import { NextResponse } from 'next/server';
import { fetchProducts } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await fetchProducts();
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Failed to load Square catalog:', error);
    return NextResponse.json(
      { error: 'Failed to load products from Square', detail: error?.message },
      { status: 500 }
    );
  }
}
