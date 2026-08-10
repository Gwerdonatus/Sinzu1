import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts } from '@/lib/catalog';
import { explainSquareError } from '@/lib/square';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // /api/products?fresh=1 bypasses the 60s cache — useful right after
  // adding a product in Square to confirm it came through.
  const fresh = request.nextUrl.searchParams.get('fresh') === '1';
  try {
    const products = await fetchProducts(fresh);
    return NextResponse.json({ products });
  } catch (error: any) {
    const detail = explainSquareError(error);
    console.error('Failed to load Square catalog:', detail, error);
    return NextResponse.json(
      { error: 'Failed to load products from Square', detail },
      { status: 500 }
    );
  }
}
