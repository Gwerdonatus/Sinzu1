'use client';

// ============================================================
// Live products from the Square catalog.
// Fetched once per visit from /api/products and shared across
// all pages via context — so the whole site reflects whatever
// is currently in your Square Dashboard.
// ============================================================
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Product } from '@/types';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getSaleProducts: () => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to load products');
      setProducts(data.products || []);
    } catch (e: any) {
      console.error('Product load error:', e);
      setError(e.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const getProductsByCategory = useCallback(
    (category: string) => {
      // Match "hair-care" / "haircare" / "hair care" / "Haircare" all the same
      const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
      const target = norm(category);
      return products.filter(
        (p) => norm(p.category) === target || (p.subcategory && norm(p.subcategory) === target)
      );
    },
    [products]
  );

  const getSaleProducts = useCallback(
    () => products.filter((p) => p.badge === 'Sale'),
    [products]
  );

  return (
    <ProductsContext.Provider
      value={{ products, loading, error, refresh, getProductById, getProductsByCategory, getSaleProducts }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}

/** Skeleton grid shown while the Square catalog loads — matches the card design. */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-gray-100 mb-3" />
          <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}
