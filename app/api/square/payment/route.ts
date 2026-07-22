import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ordersApi, paymentsApi, LOCATION_ID } from '@/lib/square';
import { fetchProducts } from '@/lib/catalog';
import { calcShippingCost, getShippingMethod } from '@/lib/shipping';
import { computeDiscount } from '@/lib/discounts';
import { sendEmail, OWNER_EMAIL } from '@/lib/email/send';
import { orderConfirmationEmail, ownerNewOrderEmail, OrderLineItem } from '@/lib/email/templates';

interface CheckoutItem {
  variationId: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceId, items, shippingMethodId, shippingAddress, discountCode } = body as {
      sourceId: string;
      items: CheckoutItem[];
      shippingMethodId: string;
      shippingAddress: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
      discountCode?: string;
    };

    if (!sourceId) {
      return NextResponse.json({ error: 'Missing payment token' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    const method = getShippingMethod(shippingMethodId);
    if (!method) {
      return NextResponse.json({ error: 'Invalid shipping method' }, { status: 400 });
    }
    const requiredAddr = method.kind === 'PICKUP'
      ? (['firstName', 'lastName', 'email'] as const)
      : (['firstName', 'lastName', 'email', 'addressLine1', 'city', 'state', 'postalCode', 'country'] as const);
    for (const field of requiredAddr) {
      if (!shippingAddress?.[field]?.trim()) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const catalog = await fetchProducts(true);
    const variationLookup = new Map<string, { price: number; inventory: number; itemName: string; varName: string }>();
    for (const p of catalog) {
      for (const v of p.variations) {
        variationLookup.set(v.id, { price: v.price, inventory: v.inventory, itemName: p.name, varName: v.name });
      }
    }

    let subtotal = 0;
    for (const item of items) {
      const v = variationLookup.get(item.variationId);
      if (!v) {
        return NextResponse.json(
          { error: 'An item in your cart is no longer available. Please refresh and try again.' },
          { status: 409 }
        );
      }
      const qty = Math.max(1, Math.floor(Number(item.quantity)));
      if (v.inventory < qty) {
        return NextResponse.json(
          { error: `Not enough stock for "${v.itemName}" (${v.varName}). Only ${v.inventory} left.` },
          { status: 409 }
        );
      }
      subtotal += v.price * qty;
    }

    const shippingCost = calcShippingCost(method.id, subtotal);

    let discountCents = 0;
    let discountLabel: string | undefined;
    let discountCodeStored: string | undefined;
    if (discountCode && discountCode.trim()) {
      const result = computeDiscount(discountCode, subtotal);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      discountCents = result.amountCents;
      discountLabel = result.discount.label;
      discountCodeStored = result.discount.code;
    }

    const total = subtotal - discountCents + shippingCost;

    const { result: orderResult } = await ordersApi.createOrder({
      idempotencyKey: uuidv4(),
      order: {
        locationId: LOCATION_ID,
        lineItems: items.map((item) => ({
          catalogObjectId: item.variationId,
          quantity: String(Math.max(1, Math.floor(Number(item.quantity)))),
        })),
        discounts: discountCents > 0
          ? [{
              name: discountLabel || `Discount ${discountCodeStored}`,
              amountMoney: { amount: BigInt(discountCents), currency: 'USD' },
              scope: 'ORDER',
            }]
          : undefined,
        serviceCharges: shippingCost > 0
          ? [{
              name: `Shipping — ${method.label}`,
              amountMoney: { amount: BigInt(shippingCost), currency: 'USD' },
              calculationPhase: 'TOTAL_PHASE',
            }]
          : undefined,
        fulfillments: [
          method.kind === 'PICKUP'
            ? {
                type: 'PICKUP',
                state: 'PROPOSED',
                pickupDetails: {
                  recipient: {
                    displayName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                    emailAddress: shippingAddress.email,
                    phoneNumber: shippingAddress.phone || undefined,
                  },
                  scheduleType: 'ASAP',
                  pickupAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
                  note: 'Local pickup at Northtown Mall — customer will receive an email when ready.',
                },
              }
            : {
                type: 'SHIPMENT',
                state: 'PROPOSED',
                shipmentDetails: {
                  recipient: {
                    displayName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                    emailAddress: shippingAddress.email,
                    phoneNumber: shippingAddress.phone || undefined,
                    address: {
                      addressLine1: shippingAddress.addressLine1,
                      addressLine2: shippingAddress.addressLine2 || undefined,
                      locality: shippingAddress.city,
                      administrativeDistrictLevel1: shippingAddress.state,
                      postalCode: shippingAddress.postalCode,
                      country: shippingAddress.country,
                    },
                  },
                  shippingType: method.label,
                },
              },
        ],
      },
    });

    const order = orderResult.order;
    if (!order?.id) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const chargeAmount = order.totalMoney?.amount ?? BigInt(total);

    const { result: paymentResult } = await paymentsApi.createPayment({
      idempotencyKey: uuidv4(),
      sourceId,
      amountMoney: { amount: chargeAmount, currency: 'USD' },
      orderId: order.id,
      locationId: LOCATION_ID,
      buyerEmailAddress: shippingAddress.email,
      shippingAddress: method.kind === 'SHIPMENT'
        ? {
            addressLine1: shippingAddress.addressLine1,
            addressLine2: shippingAddress.addressLine2 || undefined,
            locality: shippingAddress.city,
            administrativeDistrictLevel1: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
          }
        : undefined,
      note: `SINZU ${method.kind === 'PICKUP' ? 'PICKUP' : 'order'} — ${items.length} item(s), ${method.label}${discountCodeStored ? `, code ${discountCodeStored}` : ''}`,
    });

    const payment = paymentResult.payment;

    if (payment?.status === 'COMPLETED' || payment?.status === 'APPROVED') {
      const emailItems: OrderLineItem[] = items.map((i) => {
        const v = variationLookup.get(i.variationId)!;
        return {
          name: v.itemName,
          variation: v.varName,
          quantity: Math.max(1, Math.floor(Number(i.quantity))),
          priceCents: v.price,
        };
      });

      const emailArgs = {
        orderId: order.id!,
        customerFirstName: shippingAddress.firstName,
        customerEmail: shippingAddress.email,
        items: emailItems,
        subtotalCents: subtotal,
        discountCents,
        discountCode: discountCodeStored,
        shippingCents: shippingCost,
        shippingMethod: method.label,
        shippingKind: method.kind,
        timeline: method.timeline,
        totalCents: Number(chargeAmount),
        shippingAddress,
        receiptUrl: payment?.receiptUrl,
      };

      const custEmail = orderConfirmationEmail(emailArgs);
      const ownerEmail = ownerNewOrderEmail({
        ...emailArgs,
        customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      });

      Promise.all([
        sendEmail({ to: shippingAddress.email, ...custEmail, replyTo: OWNER_EMAIL }),
        sendEmail({ to: OWNER_EMAIL, ...ownerEmail, replyTo: shippingAddress.email }),
      ]).catch((e) => console.error('[order-emails] failed:', e));
    }

    return NextResponse.json({
      success: true,
      paymentId: payment?.id,
      orderId: order.id,
      status: payment?.status,
      receiptUrl: payment?.receiptUrl,
      charged: Number(chargeAmount),
      subtotal,
      shipping: shippingCost,
      discount: discountCents,
      discountCode: discountCodeStored,
    });
  } catch (error: any) {
    console.error('Square payment error:', error);
    const squareMessage = error?.result?.errors?.[0]?.detail || error?.errors?.[0]?.detail;
    return NextResponse.json(
      { error: squareMessage || error.message || 'Payment processing failed' },
      { status: 500 }
    );
  }
}