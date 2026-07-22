'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ChatWidget from '@/components/ChatWidget';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Search, X } from 'lucide-react';

/* ── Category filter tabs — retail-focused ── */
const TABS = [
  { id: 'all', label: 'All', match: null as string | null },
  { id: 'jewelry', label: 'Jewelry', match: 'jewelry' },
  { id: 'haircare', label: 'Haircare', match: 'haircare' },
  { id: 'skincare', label: 'Skincare', match: 'skincare' },
  { id: 'sale', label: 'Sale', match: '__sale__' },
];

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function ShopInner() {
  const { products, loading } = useProducts();
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlQuery = searchParams.get('q') || '';
  const urlCategory = searchParams.get('cat') || 'all';

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [activeTab, setActiveTab] = useState(urlCategory);
  const [isFocused, setIsFocused] = useState(false);

  // Keep local state in sync when URL changes
  useEffect(() => { setSearchQuery(urlQuery); }, [urlQuery]);
  useEffect(() => { setActiveTab(urlCategory); }, [urlCategory]);

  const filteredProducts = useMemo(() => {
    let list = products;
    const tab = TABS.find((t) => t.id === activeTab);
    if (tab?.match === '__sale__') {
      list = list.filter((p) => p.badge === 'Sale');
    } else if (tab?.match) {
      list = list.filter((p) =>
        normalize(p.category) === tab.match ||
        (p.subcategory && normalize(p.subcategory) === tab.match)
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return list;
  }, [products, activeTab, searchQuery]);

  const setTab = (id: string) => {
    setActiveTab(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'all') params.delete('cat');
    else params.set('cat', id);
    router.replace(`/shop${params.toString() ? `?${params}` : ''}`, { scroll: false });
  };

  const clearSearch = () => {
    setSearchQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.replace(`/shop${params.toString() ? `?${params}` : ''}`, { scroll: false });
  };

  return (
    <main className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        :root { --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .motion-fade-in { animation: fadeInUp 0.6s var(--ease-out-expo) forwards; opacity: 0; }
        .skeleton-shimmer { background: linear-gradient(90deg, #efefef 25%, #f7f7f7 50%, #efefef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }

        .shop-tab {
          padding: 8px 20px;
          font-size: 11px;
          letter-spacing: .28em;
          text-transform: uppercase;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          color: #4a4a4a;
          border: 1px solid transparent;
          border-radius: 999px;
          background: transparent;
          cursor: pointer;
          transition: all .4s var(--ease-out-expo);
          white-space: nowrap;
        }
        .shop-tab:hover { color: #000; border-color: rgba(0,0,0,.25); }
        .shop-tab.active {
          background: #000;
          color: #fff;
          border-color: #000;
        }

        /* Force every card in the grid to the same height, regardless of
           how much text or what aspect ratio its content has. */
        .product-grid { align-items: stretch; }
        .product-grid > * { height: 100%; display: flex; flex-direction: column; }

        @media (prefers-reduced-motion: reduce) {
          .motion-fade-in { animation: none !important; opacity: 1 !important; }
          .skeleton-shimmer { animation: none; }
        }
      `}</style>

      <AnnouncementBar />
      <Header />

      <div className="px-4 sm:px-6 py-10 md:py-14 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 motion-fade-in" style={{ animationDelay: '0.1s' }}>
          <p className="text-[10px] tracking-[0.35em] uppercase text-black/50 font-medium mb-4 font-inter">
            The Collection
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-semibold text-black tracking-tight leading-[1.1]">
            Shop All
          </h1>
          <div className="w-12 h-[2px] mx-auto mt-5 bg-black" />
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md mx-auto motion-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className={`relative transition-all duration-500 ${isFocused ? 'scale-[1.02]' : ''}`}>
            <div
              className={`absolute -inset-[1px] transition-opacity duration-500 rounded-full ${isFocused ? 'opacity-100' : 'opacity-0'}`}
              style={{ background: '#000' }}
            />
            <div className="relative bg-white flex items-center rounded-full border border-gray-200">
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${isFocused ? 'text-black' : 'text-gray-300'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search products..."
                className="w-full pl-12 pr-11 py-3 bg-transparent text-sm focus:outline-none font-inter tracking-wide"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          {searchQuery && !loading && (
            <p className="text-xs text-gray-400 mt-3 text-center">
              {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 motion-fade-in" style={{ animationDelay: '0.4s' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shop-tab ${activeTab === t.id ? 'active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="w-full aspect-square skeleton-shimmer mb-4" />
                <div className="h-3 w-16 skeleton-shimmer mb-2" />
                <div className="h-4 w-full skeleton-shimmer mb-2" />
                <div className="h-3 w-20 skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="product-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-4 md:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 motion-fade-in">
            <p className="text-gray-400 text-sm mb-4">No products found in this collection.</p>
            <button onClick={() => { clearSearch(); setTab('all'); }} className="text-sm underline text-black hover:text-black/60">
              Clear filters
            </button>
          </div>
        )}

        {/* Empty catalog notice — only if truly empty */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm mb-2">Our catalog is being restocked.</p>
            <p className="text-xs text-gray-400">Check back soon — new products are on the way.</p>
          </div>
        )}
      </div>

      <ChatWidget />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div />}>
      <ShopInner />
    </Suspense>
  );
}