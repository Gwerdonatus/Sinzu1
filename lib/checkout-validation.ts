export function normalizeCheckoutItems(value: unknown): { variationId: string; quantity: number }[] {
  if (!Array.isArray(value) || !value.length || value.length > 100) throw new Error('Cart must contain between 1 and 100 items');
  const quantities = new Map<string, number>();
  for (const item of value) {
    if (!item || typeof item.variationId !== 'string' || !item.variationId.trim() || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 999) {
      throw new Error('Each cart item needs a valid variation and a whole quantity from 1 to 999');
    }
    const quantity = (quantities.get(item.variationId) || 0) + item.quantity;
    if (quantity > 999) throw new Error('Too many units of one item');
    quantities.set(item.variationId, quantity);
  }
  return Array.from(quantities, ([variationId, quantity]) => ({ variationId, quantity }));
}

export function paymentAttemptKeys(attemptId: unknown) {
  if (typeof attemptId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(attemptId)) {
    throw new Error('A valid checkout attempt is required');
  }
  return { order: `order-${attemptId}`, payment: `pay-${attemptId}` };
}
