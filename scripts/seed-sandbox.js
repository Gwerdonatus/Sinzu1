/* ============================================================
 * SINZU — Square Sandbox seeder
 *
 * Creates realistic Jewelry / Haircare / Skincare products in
 * your Square SANDBOX catalog so you can test the storefront
 * immediately without adding real products yet.
 *
 * Run once:   npm run seed
 *
 * Photos: add product photos in Square Dashboard > Items &
 * Services. They will show on the site automatically.
 *
 * Description tags (write these at the START of the Square
 * item description; they will be stripped from display):
 *   [SALE:3500]  -> shows original price $35.00 crossed out
 *   [NEW]        -> "New" gold badge
 *   [BESTSELLER] -> "Best Seller" gradient badge and feeds
 *                   the Best Sellers section on the homepage
 * ============================================================ */
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const { Client, Environment } = require('square');
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? Environment.Production : Environment.Sandbox,
});
const LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

if (!process.env.SQUARE_ACCESS_TOKEN || !LOCATION_ID) {
  console.error('Missing SQUARE_ACCESS_TOKEN or NEXT_PUBLIC_SQUARE_LOCATION_ID in .env.local');
  process.exit(1);
}
if (process.env.SQUARE_ENVIRONMENT === 'production') {
  console.error('Refusing to seed a PRODUCTION account. Set SQUARE_ENVIRONMENT=sandbox.');
  process.exit(1);
}

// [name, priceCents, category, sizes[], stockPerSize, description]
const PRODUCTS = [
  ['Gold Essence Hoop Earrings', 3400, 'Jewelry', ['Small', 'Medium', 'Large'], 12,
    '[BESTSELLER] Signature gold-toned hoops in three sizes. Hypoallergenic. The everyday piece our community keeps coming back for.'],
  ['Layered Chain Necklace Set', 4200, 'Jewelry', ['16"', '18"', '20"'], 8,
    '[NEW] Three-piece layered necklace set with delicate gold-toned chains. Wear stacked or separately.'],
  ['Waist Beads - Amber Glow', 2800, 'Jewelry', ['One size'], 15,
    'Handmade waist beads with amber and gold accents. Adjustable clasp. A cultural staple, elevated.'],
  ['Waist Beads - Onyx & Gold', 2800, 'Jewelry', ['One size'], 12,
    'Onyx black beads with gold spacers. Adjustable. Wear alone or paired with another strand.'],
  ['Statement Cuff Bracelet', 3600, 'Jewelry', ['One size'], 10,
    'A single, confident piece. Gold-toned wide cuff with brushed matte finish.'],
  ['Pearl Drop Earrings', 2900, 'Jewelry', ['One size'], 18,
    'Freshwater-inspired pearl drops on gold-toned posts. Timeless.'],
  ['Ankh Pendant Necklace', 3200, 'Jewelry', ['16"', '18"'], 14,
    '[SALE:4200] Gold-toned ankh pendant on a delicate chain. Symbolic and everyday-wearable.'],

  ['Satin Silk Bonnet - Champagne', 2800, 'Haircare', ['One size'], 25,
    '[BESTSELLER] Premium satin bonnet in warm champagne. Adjustable band, no crease line in the morning.'],
  ['Satin Silk Bonnet - Onyx', 2800, 'Haircare', ['One size'], 30,
    'Classic black satin bonnet. Reversible. Adjustable band. A wardrobe staple.'],
  ['Satin Silk Bonnet - Rose Gold', 2800, 'Haircare', ['One size'], 22,
    'Rose gold satin bonnet with soft elastic band. Instagram-worthy and functional.'],
  ['Premium Silk Durag', 3200, 'Haircare', ['One size'], 20,
    'Extra-long ties for a secure hold. Premium satin lining. Available at Northtown and MOA.'],
  ['Silk Durag - Emerald', 3200, 'Haircare', ['One size'], 15,
    '[NEW] Deep emerald green satin durag. Long ties, smooth finish.'],
  ['Nourish & Growth Hair Oil', 3200, 'Haircare', ['2 oz', '4 oz'], 20,
    'Cold-pressed oil blend with rosemary, jojoba, and castor. Massage into scalp weekly.'],
  ['Satin Pillowcase - Standard', 3400, 'Haircare', ['Standard'], 16,
    'Premium satin pillowcase to protect hair and skin overnight. Hidden zipper closure.'],

  ['African Black Soap Bar - 5 oz', 1400, 'Skincare', ['5 oz'], 40,
    '[BESTSELLER] Authentic Ghanaian black soap, hand-cut. Gently cleanses without stripping. Ideal for acne-prone skin.'],
  ['African Black Soap - Family Pack (3 bars)', 3800, 'Skincare', ['3 bars'], 25,
    'Three 5oz bars of authentic African black soap. Save $4.'],
  ['Whipped Shea Butter - Original', 2800, 'Skincare', ['4 oz', '8 oz'], 35,
    'Pure unrefined shea butter, whipped for a silky finish. Unscented. Face, body, and hair.'],
  ['Whipped Shea Butter - Vanilla Amber', 3200, 'Skincare', ['4 oz', '8 oz'], 28,
    '[NEW] Warm vanilla and amber-scented shea. Deep moisture with a subtle fragrance.'],
  ['Whipped Shea Butter - Lavender Chamomile', 3200, 'Skincare', ['4 oz', '8 oz'], 22,
    'Calming lavender and chamomile essential oils. Great for nighttime routines.'],
  ['Rose Water Facial Toner', 2200, 'Skincare', ['4 oz'], 30,
    'Distilled rose water. Refreshing after cleansing, before moisturizer.'],
  ['Turmeric Glow Bar Soap', 1800, 'Skincare', ['3 oz'], 32,
    '[SALE:2400] Handmade turmeric soap for brightening. Follow with moisturizer.'],
  ['Cocoa Body Butter', 2600, 'Skincare', ['4 oz'], 24,
    'Rich cocoa butter for deep hydration. Warm sweet chocolate scent.'],
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);

async function main() {
  console.log(`Seeding Square SANDBOX catalog at location ${LOCATION_ID}...\n`);

  const categoryNames = [...new Set(PRODUCTS.map((p) => p[2]))];
  const categoryObjects = categoryNames.map((name) => ({
    type: 'CATEGORY',
    id: `#cat-${slug(name)}`,
    categoryData: { name },
  }));

  const itemObjects = PRODUCTS.map(([name, price, category, sizes, , description]) => ({
    type: 'ITEM',
    id: `#item-${slug(name)}`,
    itemData: {
      name,
      description: description || undefined,
      categories: [{ id: `#cat-${slug(category)}` }],
      reportingCategory: { id: `#cat-${slug(category)}` },
      variations: sizes.map((size) => ({
        type: 'ITEM_VARIATION',
        id: `#var-${slug(name)}-${slug(size)}`,
        itemVariationData: {
          itemId: `#item-${slug(name)}`,
          name: size,
          pricingType: 'FIXED_PRICING',
          priceMoney: { amount: BigInt(price), currency: 'USD' },
          trackInventory: true,
        },
      })),
    },
  }));

  const { result: upsertResult } = await client.catalogApi.batchUpsertCatalogObjects({
    idempotencyKey: randomUUID(),
    batches: [{ objects: [...categoryObjects, ...itemObjects] }],
  });

  const idMap = new Map(
    (upsertResult.idMappings || []).map((m) => [m.clientObjectId, m.objectId])
  );
  console.log(`Created ${categoryNames.length} categories: ${categoryNames.join(', ')}`);
  console.log(`Created ${PRODUCTS.length} items`);

  const changes = [];
  for (const [name, , , sizes, stockPerSize] of PRODUCTS) {
    for (const size of sizes) {
      const realId = idMap.get(`#var-${slug(name)}-${slug(size)}`);
      if (!realId) continue;
      changes.push({
        type: 'PHYSICAL_COUNT',
        physicalCount: {
          catalogObjectId: realId,
          state: 'IN_STOCK',
          locationId: LOCATION_ID,
          quantity: String(stockPerSize),
          occurredAt: new Date().toISOString(),
        },
      });
    }
  }
  for (let i = 0; i < changes.length; i += 100) {
    await client.inventoryApi.batchChangeInventory({
      idempotencyKey: randomUUID(),
      changes: changes.slice(i, i + 100),
    });
  }
  console.log(`Set stock for ${changes.length} variations`);
  console.log(`\nDone. Open your site - products are now live from Square.`);
  console.log(`Add photos in Square Dashboard > Items & Services.`);
  console.log(`When ready, delete these test items and add your real catalog.`);
}

main().catch((e) => {
  console.error('\nSeeding failed:', e?.result?.errors || e.message || e);
  process.exit(1);
});
