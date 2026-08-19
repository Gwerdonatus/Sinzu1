// ============================================================
// Server-side catalog layer.
// Pulls ITEMs, IMAGEs and CATEGORYs from the Square Catalog API,
// plus live stock from the Inventory API, and maps everything to
// the Product shape the SINZU UI already uses.
//
// Anything you add / edit / delete in your Square Dashboard
// (Items & Services) shows up on the site automatically.
// ============================================================
import { catalogApi, inventoryApi, LOCATION_ID } from '@/lib/square';
import { Product, ProductVariation } from '@/types';

const PLACEHOLDER_IMAGE = '/images/placeholder-product.svg';

// Small in-memory cache so browsing the site doesn't hammer the
// Square API. Anything added or edited in the Square app appears on
// the site within CACHE_TTL_MS of the next page load — kept short so
// the shop reads as "post it and it's live".
const CACHE_TTL_MS = 15 * 1000; // 15 seconds
let cache: { products: Product[]; fetchedAt: number } | null = null;

/**
 * Why an item in the Square catalog did not make it onto the storefront.
 * Surfaced by /api/square/health so "my product isn't showing" has an answer.
 */
export interface SkippedItem {
  id: string;
  name: string;
  reason: string;
}
let lastSkipped: SkippedItem[] = [];
export function getSkippedItems(): SkippedItem[] {
  return lastSkipped;
}

/**
 * Square objects can be scoped to specific locations. An item that isn't
 * present at our location has no inventory and can't be ordered there, so
 * it must not appear on the site.
 */
function availableAtLocation(obj: any): boolean {
  if (!LOCATION_ID) return true;
  if (obj.presentAtAllLocations) {
    return !(obj.absentAtLocationIds ?? []).includes(LOCATION_ID);
  }
  return (obj.presentAtLocationIds ?? []).includes(LOCATION_ID);
}

export async function fetchProducts(forceFresh = false): Promise<Product[]> {
  if (!forceFresh && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.products;
  }

  // 1) Pull the full catalog (items + images + categories), paginated.
  const objects: any[] = [];
  let cursor: string | undefined = undefined;
  do {
    const { result } = await catalogApi.listCatalog(cursor, 'ITEM,IMAGE,CATEGORY');
    if (result.objects) objects.push(...result.objects);
    cursor = result.cursor ?? undefined;
  } while (cursor);

  // Only items that are actually sellable on this site. Anything filtered
  // out is recorded with a reason so the health endpoint can explain it.
  const skipped: SkippedItem[] = [];
  const items = objects.filter((o) => {
    if (o.type !== 'ITEM') return false;
    const d = o.itemData ?? {};
    const label = { id: o.id, name: d.name ?? '(unnamed)' };

    if (o.isDeleted) return false; // deleted in Square — not worth reporting
    if (d.isArchived) {
      skipped.push({ ...label, reason: 'Archived in Square. Unarchive it to sell online.' });
      return false;
    }
    // Square's "Site visibility" control. Unset means the item predates the
    // setting or was created in the POS app — treat that as visible.
    if (d.ecomVisibility === 'PRIVATE' || d.ecomVisibility === 'UNAVAILABLE') {
      skipped.push({
        ...label,
        reason: `Square site visibility is ${d.ecomVisibility}. Set it to Visible to sell online.`,
      });
      return false;
    }
    if (!availableAtLocation(o)) {
      skipped.push({
        ...label,
        reason: `Not available at location ${LOCATION_ID}. Enable this item for that location in Square.`,
      });
      return false;
    }
    return true;
  });

  const imagesById = new Map<string, string>();
  const categoriesById = new Map<string, string>();

  for (const o of objects) {
    if (o.type === 'IMAGE' && o.imageData?.url) imagesById.set(o.id, o.imageData.url);
    if (o.type === 'CATEGORY' && o.categoryData?.name) categoriesById.set(o.id, o.categoryData.name);
  }

  // 2) Collect every variation ID and fetch live inventory in batches of 100.
  const variationIds: string[] = [];
  for (const item of items) {
    for (const v of item.itemData?.variations ?? []) variationIds.push(v.id);
  }

  const inventoryByVariation = new Map<string, number>();
  for (let i = 0; i < variationIds.length; i += 100) {
    const batch = variationIds.slice(i, i + 100);
    try {
      const { result } = await inventoryApi.batchRetrieveInventoryCounts({
        catalogObjectIds: batch,
        locationIds: [LOCATION_ID],
      });
      for (const count of result.counts ?? []) {
        if (count.state === 'IN_STOCK' && count.catalogObjectId) {
          inventoryByVariation.set(count.catalogObjectId, Number(count.quantity ?? 0));
        }
      }
    } catch (e) {
      // If inventory tracking isn't enabled for some items, treat them as in stock.
      console.warn('Inventory fetch failed for a batch — items default to in stock.', e);
    }
  }

  // 3) Map Square items -> UI products.
  const products: (Product | null)[] = items.map((item) => {
    const d = item.itemData!;

    const variations: ProductVariation[] = (d.variations ?? [])
      // A variation with no priceMoney uses Square's "Variable" pricing —
      // the cashier types the price at the register. There is no price to
      // show or charge online, so it can't be listed.
      .filter((v: any) => v.itemVariationData?.priceMoney?.amount != null)
      .map((v: any) => {
        const vd = v.itemVariationData ?? {};
        const tracked = inventoryByVariation.has(v.id);
        return {
          id: v.id,
          name: vd.name || 'One size',
          price: Number(vd.priceMoney.amount),
          // Untracked variations are shown as available (999) so items
          // without inventory tracking can still be purchased.
          inventory: tracked ? inventoryByVariation.get(v.id)! : 999,
        };
      });

    if (variations.length === 0) {
      skipped.push({
        id: item.id,
        name: d.name ?? '(unnamed)',
        reason:
          'No variation has a fixed price (Square "Variable" pricing). ' +
          'Set a price on the item in Square to sell it online.',
      });
      return null;
    }

    const prices = variations.map((v) => v.price).filter((p) => p > 0);
    const minPrice = prices.length ? Math.min(...prices) : 0;

    const imageUrls = (d.imageIds ?? [])
      .map((id: string) => imagesById.get(id))
      .filter(Boolean) as string[];

    // Category: Square items can have a reporting category or category list.
    const categoryId: string | undefined =
      (d as any).reportingCategory?.id ??
      (d as any).categories?.[0]?.id ??
      (d as any).categoryId;
    const categoryName = (categoryId && categoriesById.get(categoryId)) || 'Shop';

    // Badge + originalPrice: driven by tags at the START of the Square
    // item description. Tags are stripped before display.
    //   [SALE:6500]  → shows "$65.00" crossed out + "Sale" badge
    //   [NEW]        → "New" badge
    //   [BESTSELLER] → "Best Seller" badge (also picked up by Best Sellers section)
    //   [FEATURED]   → pins the item into the homepage Featured row
    // Multiple tags are allowed, e.g. "[NEW][SALE:3500] Summer glow"
    let badge: string | undefined;
    let originalPrice: number | undefined;
    let featured = false;
    let description = d.description ?? undefined;

    // Iteratively strip tags at the head of the description.
    const tagRe = /^\s*\[(SALE:\d+|NEW|BESTSELLER|FEATURED)\]\s*/i;
    while (description && tagRe.test(description)) {
      const m = description.match(tagRe)!;
      const tag = m[1].toUpperCase();
      if (tag.startsWith('SALE:')) {
        badge = 'Sale';
        originalPrice = Number(tag.slice(5));
      } else if (tag === 'NEW') {
        badge = badge || 'New';
      } else if (tag === 'BESTSELLER') {
        badge = 'Best Seller';
      } else if (tag === 'FEATURED') {
        // Deliberately does not set a badge — being featured is placement,
        // not a label, so it can coexist with Sale or New.
        featured = true;
      }
      description = description.replace(m[0], '');
    }

    const totalInventory = variations.reduce(
      (sum, v) => sum + (v.inventory >= 999 ? 999 : v.inventory),
      0
    );

    return {
      id: item.id,
      name: d.name ?? 'Untitled product',
      description,
      price: minPrice,
      originalPrice,
      image: imageUrls[0] ?? PLACEHOLDER_IMAGE,
      images: imageUrls.length ? imageUrls : [PLACEHOLDER_IMAGE],
      category: categoryName,
      badge,
      featured,
      sizes: variations.map((v) => v.name),
      variations,
      inventory: totalInventory > 999 ? 999 : totalInventory,
    };
  });

  const sellable = products.filter((p): p is Product => p !== null);

  lastSkipped = skipped;
  if (skipped.length) {
    console.warn(
      `[catalog] ${skipped.length} Square item(s) hidden from the storefront:\n` +
        skipped.map((s) => `  - ${s.name}: ${s.reason}`).join('\n')
    );
  }

  cache = { products: sellable, fetchedAt: Date.now() };
  return sellable;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((p) => p.id === id) ?? null;
}
