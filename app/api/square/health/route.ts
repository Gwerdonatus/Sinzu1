// ============================================================
// Square connection check.  GET /api/square/health
//
// Answers, in one request: are the credentials valid, do they point
// at the right environment and location, how many products reached
// the storefront, and why any Square item did not.
//
// Read-only. Never returns the access token or any secret.
// ============================================================
import { NextResponse } from 'next/server';
import {
  locationsApi,
  LOCATION_ID,
  SQUARE_ENV,
  configProblems,
  explainSquareError,
} from '@/lib/square';
import { fetchProducts, getSkippedItems } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: { name: string; ok: boolean; detail: string }[] = [];
  const push = (name: string, ok: boolean, detail: string) => checks.push({ name, ok, detail });

  // 1. Environment variables present and internally consistent.
  const problems = configProblems();
  push(
    'Environment variables',
    problems.length === 0,
    problems.length === 0
      ? `All Square variables set for the ${SQUARE_ENV} environment.`
      : problems.join(' ')
  );

  if (problems.length) {
    return NextResponse.json({ ok: false, environment: SQUARE_ENV, checks }, { status: 500 });
  }

  // 2. The access token is accepted, and the configured location exists.
  let locationName: string | null = null;
  try {
    const { result } = await locationsApi.listLocations();
    const locations = result.locations ?? [];
    push(
      'Access token',
      true,
      `Accepted by Square (${SQUARE_ENV}). ${locations.length} location(s) on the account.`
    );

    const match = locations.find((l) => l.id === LOCATION_ID);
    locationName = match?.name ?? null;
    push(
      'Location ID',
      !!match,
      match
        ? `"${match.name}" (${LOCATION_ID}), status ${match.status}, currency ${match.currency}.`
        : `${LOCATION_ID} is not a location on this account. Available: ` +
            locations.map((l) => `${l.id} (${l.name})`).join(', ')
    );
  } catch (error: any) {
    push('Access token', false, explainSquareError(error));
    return NextResponse.json({ ok: false, environment: SQUARE_ENV, checks }, { status: 500 });
  }

  // 3. The catalog actually maps to storefront products.
  try {
    const products = await fetchProducts(true);
    const skipped = getSkippedItems();

    push(
      'Catalog read',
      products.length > 0,
      products.length > 0
        ? `${products.length} product(s) live on the site.`
        : 'Square returned no sellable items. Add an item in the Square app, or see "Hidden items" below.'
    );

    const withoutImage = products.filter((p) => p.image.startsWith('/images/placeholder'));
    push(
      'Product images',
      withoutImage.length === 0,
      withoutImage.length === 0
        ? 'Every product has at least one image from Square.'
        : `${withoutImage.length} product(s) fall back to the placeholder image: ` +
            withoutImage.map((p) => p.name).join(', ')
    );

    const uncategorised = products.filter((p) => p.category === 'Shop');
    push(
      'Categories',
      uncategorised.length === 0,
      uncategorised.length === 0
        ? `Categories in use: ${Array.from(new Set(products.map((p) => p.category))).join(', ')}`
        : `${uncategorised.length} product(s) have no Square category and only appear under /shop: ` +
            uncategorised.map((p) => p.name).join(', ')
    );

    push(
      'Hidden items',
      skipped.length === 0,
      skipped.length === 0
        ? 'No Square items were filtered out.'
        : `${skipped.length} item(s) in Square are not on the site.`
    );

    return NextResponse.json({
      ok: checks.every((c) => c.ok),
      environment: SQUARE_ENV,
      locationId: LOCATION_ID,
      locationName,
      productCount: products.length,
      checks,
      hiddenItems: skipped,
    });
  } catch (error: any) {
    push('Catalog read', false, explainSquareError(error));
    return NextResponse.json({ ok: false, environment: SQUARE_ENV, checks }, { status: 500 });
  }
}
