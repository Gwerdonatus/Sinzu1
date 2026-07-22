'use client';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useProducts, ProductGridSkeleton } from '@/hooks/useProducts';

/* =========================================================
   Best Sellers — up to 6 products. Reads Square catalog and
   prefers items with a "Best Seller" badge (set via the
   [BESTSELLER] tag in a Square item description). Falls back
   to the first 6 products so the section never renders empty.
   ========================================================= */
export default function BestSellers() {
  const { products, loading } = useProducts();

  // Prefer explicitly-flagged best sellers, otherwise first 6.
  const flagged = products.filter((p) => p.badge === 'Best Seller');
  const featured = (flagged.length ? flagged : products).slice(0, 6);

  return (
    <section className="sinzu-best" aria-label="Best sellers">
      <style>{`
        .sinzu-best{
          padding:clamp(56px,7vw,100px) clamp(20px,5vw,60px);
          background:#fff;
          font-family:'Inter','Helvetica Neue',sans-serif;
        }
        .sb-inner{ max-width:1400px; margin:0 auto; }
        .sb-header{ text-align:center; margin-bottom:clamp(2.5rem,5vw,4rem); }
        .sb-eyebrow{
          font-size:10px; letter-spacing:.42em; text-transform:uppercase;
          color:#8b6914; margin-bottom:.9rem;
          display:inline-flex; align-items:center; gap:.9rem;
        }
        .sb-eyebrow::before,
        .sb-eyebrow::after{
          content:''; display:inline-block; width:32px; height:1px;
          background:linear-gradient(90deg,transparent,#c9a227,transparent);
        }
        .sb-title{
          font-family:'Playfair Display',Georgia,serif;
          font-weight:600; font-style:italic;
          font-size:clamp(1.9rem,4vw,3rem); line-height:1.05;
          color:#1a1200;
          margin-bottom:.7rem;
        }
        .sb-sub{
          font-size:14px; letter-spacing:.02em; color:rgba(26,18,0,.6);
          max-width:44ch; margin:0 auto;
        }
        .sb-grid{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:clamp(1rem,2vw,1.8rem) clamp(.75rem,1.5vw,1.4rem);
        }
        @media(min-width:768px){
          .sb-grid{ grid-template-columns:repeat(3,1fr); }
        }
        @media(min-width:1200px){
          .sb-grid{ grid-template-columns:repeat(6,1fr); }
        }
        .sb-cta{
          display:flex; justify-content:center; margin-top:clamp(2rem,4vw,3rem);
        }
        .sb-cta a{
          display:inline-flex; align-items:center; gap:.7rem;
          padding:14px 34px;
          border:1px solid #1a1200;
          border-radius:999px;
          font-size:11px; font-weight:500;
          letter-spacing:.32em; text-transform:uppercase;
          color:#1a1200; text-decoration:none;
          transition:all .5s cubic-bezier(.3,.7,.2,1);
        }
        .sb-cta a:hover{ background:#1a1200; color:#e2c471; }
      `}</style>

      <div className="sb-inner">
        <header className="sb-header">
          <div className="sb-eyebrow">Most Loved</div>
          <h2 className="sb-title">Best Sellers</h2>
          <p className="sb-sub">
            The pieces our community keeps coming back for — hand-picked essentials in jewelry, haircare, and skincare.
          </p>
        </header>

        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="sb-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="sb-cta">
          <Link href="/shop">Shop All</Link>
        </div>
      </div>
    </section>
  );
}
