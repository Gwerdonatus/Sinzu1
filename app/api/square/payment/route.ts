import { NextRequest, NextResponse } from 'next/server';
import { normalizeCheckoutItems, paymentAttemptKeys } from '@/lib/checkout-validation';
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
    const { attemptId, quotedTotal, sourceId, items: rawItems, shippingMethodId, shippingAddress, discountCode } = body as {
      attemptId: string;
      quotedTotal: number;
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

    if (typeof sourceId !== 'string' || !sourceId.trim()) {
      return NextResponse.json({ error: 'Missing payment token' }, { status: 400 });
    }
    if (!Number.isSafeInteger(quotedTotal) || quotedTotal <= 0) return NextResponse.json({ error: 'A valid quoted total is required', resetAttempt: true }, { status: 400 });
    let keys;
    try { keys = paymentAttemptKeys(attemptId); }
    catch (error) { return NextResponse.json({ error: (error as Error).message, resetAttempt: true }, { status: 400 }); }
    let items: CheckoutItem[];
    try { items = normalizeCheckoutItems(rawItems); }
    catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400 }); }
    if (discountCode !== undefined && typeof discountCode !== 'string') return NextResponse.json({ error: 'Invalid discount code' }, { status: 400 });
    const method = getShippingMethod(shippingMethodId);
    if (!method) {
      return NextResponse.json({ error: 'Invalid shipping method' }, { status: 400 });
    }
    const requiredAddr = method.kind === 'PICKUP'
      ? (['firstName', 'lastName', 'email', 'phone'] as const)
      : (['firstName', 'lastName', 'email', 'addressLine1', 'city', 'state', 'postalCode', 'country'] as const);
    for (const field of requiredAddr) {
      if (typeof shippingAddress?.[field] !== 'string' || !shippingAddress[field]!.trim()) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(shippingAddress.email)) return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    if (method.kind === 'SHIPMENT' && shippingAddress.country.trim().toUpperCase() !== 'US') return NextResponse.json({ error: 'Shipping is currently available within the United States only' }, { status: 400 });
    shippingAddress.country = 'US';
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

    if (total > quotedTotal) return NextResponse.json({ error: 'Prices have changed. Contact support to confirm this payment attempt before retrying.' }, { status: 409 });

    const { result: orderResult } = await ordersApi.createOrder({
      idempotencyKey: keys.order,
      order: {
        locationId: LOCATION_ID,
        referenceId: attemptId,
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
              name: `Shipping: ${method.label}`,
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
                  note: 'Local pickup at Northtown Mall. Customer will receive an email when ready.',
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

    // Square recomputes the total from the catalog, and that recomputation is
    // what gets charged. If it comes back higher than the figure on the Pay
    // button — the usual cause is a tax configured on the item or location in
    // Square, which this checkout does not display — charging it would bill
    // the customer more than they agreed to. Refuse instead of overcharging.
    const squareTotal = Number(order.totalMoney?.amount ?? BigInt(total));
    if (squareTotal > total) {
      console.error(
        `[checkout] Square total ${squareTotal} exceeds quoted total ${total}. ` +
          `Order ${order.id} left unpaid. Likely a tax applied in Square that the ` +
          `site does not show at checkout.`
      );
      return NextResponse.json(
        {
          error:
            'We could not complete this order because the total did not match what was quoted. ' +
            'Please contact hello@sinzu.shop to confirm the order status before trying again.',
        },
        { status: 409 }
      );
    }
    const chargeAmount = order.totalMoney?.amount ?? BigInt(total);

    // Square stores the attempt via its idempotency keys. Reconcile an already
    // paid order before stock validation: a successful first request may have
    // consumed the last unit while its HTTP response was lost.
    const { result: freshOrder } = await ordersApi.retrieveOrder(order.id);
    let payment;
    for (const tender of freshOrder.order?.tenders ?? []) {
      if (!tender.paymentId) continue;
      const { result } = await paymentsApi.getPayment(tender.paymentId);
      if (result.payment?.status === 'COMPLETED') { payment = result.payment; break; }
    }
    if (!payment) {
      for (const item of items) {
        const v = variationLookup.get(item.variationId)!;
        if (v.inventory < item.quantity) {
          return NextResponse.json({ error: `Not enough stock for "${v.itemName}" (${v.varName}). Please contact support if this is a payment retry.`, orderId: order.id }, { status: 409 });
        }
      }
      const { result: paymentResult } = await paymentsApi.createPayment({
        idempotencyKey: keys.payment,
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
        note: `SINZU ${method.kind === 'PICKUP' ? 'PICKUP' : 'order'}: ${items.length} item(s), ${method.label}${discountCodeStored ? `, code ${discountCodeStored}` : ''}`,
      });
      payment = paymentResult.payment;
    }
    if (!payment || payment.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Payment has not completed. Please contact support before retrying.', orderId: order.id, status: payment?.status, resetAttempt: payment?.status === 'FAILED' || payment?.status === 'CANCELED' }, { status: 409 });
    }
    let emailed = false;

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

      // These must be awaited. On serverless the instance can be frozen the
      // moment the response is returned, which would abandon in-flight sends
      // and silently drop confirmation emails — while the success page tells
      // the customer one was sent. Payment has already succeeded here, so a
      // failed send is logged and reported, never fatal.
      try {
        const [toCustomer, toOwner] = await Promise.all([
          sendEmail({ to: shippingAddress.email, ...custEmail, replyTo: OWNER_EMAIL, idempotencyKey: `order-${order.id}-customer` }),
          sendEmail({ to: OWNER_EMAIL, ...ownerEmail, replyTo: shippingAddress.email, idempotencyKey: `order-${order.id}-owner` }),
        ]);
        emailed = toCustomer.ok && toOwner.ok;
        if (!emailed) {
          console.error('[order-emails] order', order.id, {
            customer: toCustomer.error ?? 'ok',
            owner: toOwner.error ?? 'ok',
          });
        }
      } catch (e) {
        console.error('[order-emails] threw for order', order.id, e);
      }
    }

    return NextResponse.json({
      success: true,
      paymentId: payment?.id,
      orderId: order.id,
      status: payment?.status,
      emailed,
      receiptUrl: payment?.receiptUrl,
      charged: Number(chargeAmount),
      subtotal,
      shipping: shippingCost,
      discount: discountCents,
      discountCode: discountCodeStored,
    });
  } catch (error: any) {
    const code = error?.result?.errors?.[0]?.code || error?.errors?.[0]?.code;
    console.error('Square payment error', { code, statusCode: error?.statusCode });
    const declined = ['CARD_DECLINED', 'CVV_FAILURE', 'ADDRESS_VERIFICATION_FAILURE', 'CARD_EXPIRED', 'INSUFFICIENT_FUNDS'].includes(code);
    return NextResponse.json(
      { error: declined ? 'Your card was declined. Check your card details or use another card.' : 'We could not confirm the payment. Retry the same attempt or contact support before starting another order.', resetAttempt: declined },
      { status: 500 }
    );
  }
}