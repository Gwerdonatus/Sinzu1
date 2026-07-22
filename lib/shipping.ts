// ============================================================
// Shipping & Pickup methods — mirrors Square Online's setup:
// PICKUP for local pickup at the retail location, SHIPMENT for
// carrier delivery. The payment route uses the fulfillment
// `type` to attach the right kind of fulfillment to the Square
// order so it appears correctly in Dashboard > Orders.
//
// All amounts in CENTS (USD). Edit freely.
// ============================================================

export type FulfillmentKind = 'PICKUP' | 'SHIPMENT';

export interface ShippingMethod {
  id: string;
  label: string;
  description: string;
  amount: number; // cents
  kind: FulfillmentKind;
  /** Displayed on the confirmation page timeline. */
  timeline: string[];
}

/** Orders at/above this subtotal (cents) get free standard shipping. */
export const FREE_SHIPPING_THRESHOLD = 15000; // $150.00

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'pickup',
    label: 'Free Local Pickup',
    description: 'Pick up at Northtown Mall (Blaine, MN) — usually ready same day',
    amount: 0,
    kind: 'PICKUP',
    timeline: [
      'Order received',
      'We prepare your order (same day, usually within a few hours)',
      "You'll get an email when it's ready for pickup",
      'Come by Northtown Mall during regular mall hours',
    ],
  },
  {
    id: 'standard',
    label: 'Standard Shipping',
    description: '5–7 business days · USPS or UPS Ground',
    amount: 1000, // $10.00
    kind: 'SHIPMENT',
    timeline: [
      'Order received',
      'We pack your order (1–3 business days)',
      "You'll get an email with a tracking number when it ships",
      'Delivered to your door in 5–7 business days',
    ],
  },
  {
    id: 'express',
    label: 'Express Shipping',
    description: '2–3 business days · USPS Priority or UPS 2-Day',
    amount: 2500, // $25.00
    kind: 'SHIPMENT',
    timeline: [
      'Order received',
      'We pack your order (usually same or next business day)',
      "You'll get an email with a tracking number when it ships",
      'Delivered in 2–3 business days',
    ],
  },
];

export function getShippingMethod(id: string): ShippingMethod | undefined {
  return SHIPPING_METHODS.find((m) => m.id === id);
}

/** Final shipping cost after free-shipping rule. */
export function calcShippingCost(methodId: string, subtotalCents: number): number {
  const method = getShippingMethod(methodId);
  if (!method) return 0;
  if (method.kind === 'PICKUP') return 0;
  if (method.id === 'standard' && subtotalCents >= FREE_SHIPPING_THRESHOLD) return 0;
  return method.amount;
}