// ============================================================
// Recently Viewed — client-only, backed by localStorage.
// No account required; keeps the last 8 product IDs the shopper
// has looked at.
// ============================================================

const STORAGE_KEY = 'sinzu-recently-viewed';
const MAX_ITEMS = 8;

export function pushRecentlyViewed(productId: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((id) => id !== productId);
    const next = [productId, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / json errors */
  }
}

export function getRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
