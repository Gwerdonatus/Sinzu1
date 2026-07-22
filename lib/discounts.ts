// ============================================================
// Discount codes — server-side source of truth.
// Used by /api/discount/validate (checkout preview) AND
// the payment route (final charge), so the code and amount
// can never be tampered with from the browser.
//
// EDIT amounts and add new codes freely here — no rebuild needed.
// ============================================================

export interface DiscountCode {
  code: string;
  label: string;
  /** 'percent' → percentOff (0-100), 'fixed' → amountOffCents. */
  kind: 'percent' | 'fixed';
  percentOff?: number;   // e.g. 15 for 15% off
  amountOffCents?: number; // e.g. 500 for $5.00 off
  /** Minimum subtotal (cents) required. */
  minSubtotalCents?: number;
  /** Optional expiration (ISO date). Undefined = no expiry. */
  expiresAt?: string;
  /** Human-readable description shown after successful apply. */
  description: string;
}

const CODES: DiscountCode[] = [
  {
    code: 'MOA15',
    label: 'Mall of America — 15% off',
    kind: 'percent',
    percentOff: 15,
    description: '15% off your order',
  },
  {
    code: 'WELCOME10',
    label: 'Welcome — 10% off first order',
    kind: 'percent',
    percentOff: 10,
    description: '10% off your first order',
  },
];

/** Look up a code case-insensitively. Returns undefined for unknown codes. */
export function findDiscount(code: string): DiscountCode | undefined {
  const c = code.trim().toUpperCase();
  return CODES.find((d) => d.code === c);
}

/** Compute the discount amount (cents) for a given subtotal, or an error. */
export function computeDiscount(
  code: string,
  subtotalCents: number
): { ok: true; discount: DiscountCode; amountCents: number } | { ok: false; error: string } {
  const discount = findDiscount(code);
  if (!discount) return { ok: false, error: 'That code is not valid.' };

  if (discount.expiresAt && new Date(discount.expiresAt).getTime() < Date.now()) {
    return { ok: false, error: 'This code has expired.' };
  }
  if (discount.minSubtotalCents && subtotalCents < discount.minSubtotalCents) {
    const min = (discount.minSubtotalCents / 100).toFixed(2);
    return { ok: false, error: `Minimum order of $${min} required for this code.` };
  }

  let amount = 0;
  if (discount.kind === 'percent' && discount.percentOff) {
    amount = Math.floor((subtotalCents * discount.percentOff) / 100);
  } else if (discount.kind === 'fixed' && discount.amountOffCents) {
    amount = Math.min(discount.amountOffCents, subtotalCents);
  }

  return { ok: true, discount, amountCents: amount };
}
