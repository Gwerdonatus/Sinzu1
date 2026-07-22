'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { getRecentlyViewed } from '@/lib/recentlyViewed';

interface Props {
  /** Exclude this product ID (usually the current product page). */
  excludeId?: string;
}

export default function RecentlyViewed({ excludeId }: Props) {
  const { products } = useProducts();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getRecentlyViewed().filter((id) => id !== excludeId));
  }, [excludeId]);

  // Map IDs (in order) to products still in the live catalog
  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  if (items.length < 2) return null;

  return (
    <section className="sinzu-recent" aria-label="Recently viewed">
      <style>{`
        .sinzu-recent{
          padding:clamp(48px,6vw,80px) clamp(20px,5vw,60px);
          background:#fdfaf4;
          font-family:'Inter','Helvetica Neue',sans-serif;
        }
        .sr-inner{ max-width:1200px; margin:0 auto; }
        .sr-header{ text-align:center; margin-bottom:2.4rem; }
        .sr-eyebrow{
          font-size:10px; letter-spacing:.4em; text-transform:uppercase;
          color:#8b6914; margin-bottom:.7rem;
        }
        .sr-title{
          font-family:'Playfair Display',Georgia,serif;
          font-weight:600; font-style:italic;
          font-size:clamp(1.5rem,3vw,2.2rem); color:#1a1200;
        }
        .sr-grid{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:1rem;
        }
        @media(min-width:768px){ .sr-grid{ grid-template-columns:repeat(4,1fr); } }
      `}</style>
      <div className="sr-inner">
        <header className="sr-header">
          <div className="sr-eyebrow">You Left These Behind</div>
          <h3 className="sr-title">Recently Viewed</h3>
        </header>
        <div className="sr-grid">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
