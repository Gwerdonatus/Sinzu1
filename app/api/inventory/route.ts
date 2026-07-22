import { NextResponse } from 'next/server';
import { fetchProducts } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

// Live stock levels straight from Square (per product + per variation).
export async function GET() {
  try {
    const products = await fetchProducts(true);
    return NextResponse.json(
      products.map((p) => ({
        id: p.id,
        name: p.name,
        inventory: p.inventory,
        inStock: p.inventory > 0,
        lowStock: p.inventory > 0 && p.inventory <= 5,
        variations: p.variations.map((v) => ({
          id: v.id,
          name: v.name,
          inventory: v.inventory,
        })),
      }))
    );
  } catch (error: any) {
    console.error('Inventory fetch failed:', error);
    return NextResponse.json({ error: 'Failed to load inventory' }, { status: 500 });
  }
}
