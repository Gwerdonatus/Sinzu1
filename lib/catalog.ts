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
// Square API. Stock/product changes appear within CACHE_TTL_MS.
const CACHE_TTL_MS = 60 * 1000; // 1 minute
let cache: { products: Product[]; fetchedAt: number } | null = null;

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

  const items = objects.filter((o) => o.type === 'ITEM' && !o.isDeleted);
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
  const products: Product[] = items.map((item) => {
    const d = item.itemData!;

    const variations: ProductVariation[] = (d.variations ?? []).map((v: any) => {
      const vd = v.itemVariationData ?? {};
      const tracked = inventoryByVariation.has(v.id);
      return {
        id: v.id,
        name: vd.name || 'One size',
        price: Number(vd.priceMoney?.amount ?? 0),
        // Untracked variations are shown as available (999) so items
        // without inventory tracking can still be purchased.
        inventory: tracked ? inventoryByVariation.get(v.id)! : 999,
      };
    });

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
    // Multiple tags are allowed, e.g. "[NEW][SALE:3500] Summer glow"
    let badge: string | undefined;
    let originalPrice: number | undefined;
    let description = d.description ?? undefined;

    // Iteratively strip tags at the head of the description.
    const tagRe = /^\s*\[(SALE:\d+|NEW|BESTSELLER)\]\s*/i;
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
      sizes: variations.map((v) => v.name),
      variations,
      inventory: totalInventory > 999 ? 999 : totalInventory,
    };
  });

  cache = { products, fetchedAt: Date.now() };
  return products;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((p) => p.id === id) ?? null;
}
