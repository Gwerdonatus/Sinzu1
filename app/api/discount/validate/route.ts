import { NextRequest, NextResponse } from 'next/server';
import { computeDiscount } from '@/lib/discounts';
import { fetchProducts } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

// Preview the discount amount from a cart before checkout.
// The final charge still recomputes on the server in the payment
// route — this endpoint is purely for showing the customer their
// new total live in the UI.
export async function POST(request: NextRequest) {
  try {
    const { code, items } = await request.json() as {
      code: string;
      items: { variationId: string; quantity: number }[];
    };

    if (!code) return NextResponse.json({ error: 'Enter a discount code' }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    // Re-price from live Square catalog (same source the payment route uses).
    const catalog = await fetchProducts();
    const priceOf = new Map<string, number>();
    for (const p of catalog) for (const v of p.variations) priceOf.set(v.id, v.price);

    let subtotal = 0;
    for (const item of items) {
      const price = priceOf.get(item.variationId);
      if (price === undefined) {
        return NextResponse.json(
          { error: 'An item in your cart is no longer available' },
          { status: 409 }
        );
      }
      subtotal += price * Math.max(1, Math.floor(Number(item.quantity)));
    }

    const result = computeDiscount(code, subtotal);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      code: result.discount.code,
      description: result.discount.description,
      subtotalCents: subtotal,
      discountCents: result.amountCents,
      totalAfterDiscount: subtotal - result.amountCents,
    });
  } catch (e: any) {
    console.error('Discount validate error:', e);
    return NextResponse.json({ error: 'Could not validate discount' }, { status: 500 });
  }
}
