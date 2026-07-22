'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import ChatWidget from '@/components/ChatWidget';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCard from '@/components/ProductCard';
import RecentlyViewed from '@/components/sections/RecentlyViewed';
import ProductReviews from '@/components/sections/ProductReviews';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { pushRecentlyViewed } from '@/lib/recentlyViewed';
import { ChevronLeft, ChevronRight, Share2, Minus, Plus, ShoppingBag, Check, AlertCircle, Loader2, Info, Truck, Package, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ProductPageClient({ id }: { id: string }) {
  const { products, loading, getProductById } = useProducts();
  const product = getProductById(decodeURIComponent(id));
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  const variation = useMemo(() => {
    if (!product) return undefined;
    const name = selectedSize ?? product.sizes[0];
    return product.variations.find(v => v.name === name) ?? product.variations[0];
  }, [product, selectedSize]);

  useEffect(() => {
    setImageLoaded({});
    setImg(0);
    if (product?.id) pushRecentlyViewed(product.id);
  }, [id, product?.id]);

  const handleImageLoad = useCallback((index: number) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  }, []);

  if (loading) return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar /><Header />
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-5 h-5 animate-spin text-black/10" />
      </div>
    </main>
  );

  if (!product) return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar /><Header />
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-black/30 text-sm font-inter tracking-wide">Product not found</p>
      </div>
    </main>
  );

  const size = selectedSize ?? product.sizes[0] ?? 'One size';
  const price = variation?.price ?? product.price;
  const stock = variation?.inventory ?? product.inventory;
  const images = product.images.length ? product.images : [product.image];
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const formattedPrice = (p: number) => `$${(p / 100).toFixed(2)}`;

  const handleAdd = () => {
    if (!variation || stock === 0) return;
    if (qty > stock) { alert(`Only ${stock} available`); return; }
    addItem({ id: product.id, name: product.name, price, quantity: qty, image: images[0], size, variantId: variation.id });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const outOfStock = stock === 0;
  const lowStock = stock > 0 && stock <= 5;
  const trackedStock = stock < 999;

  return (
    <main className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }

        .font-inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }

        .motion-fade { animation: fadeIn 0.6s var(--ease-out-expo) forwards; opacity: 0; }
        .motion-up { animation: fadeInUp 0.6s var(--ease-out-expo) forwards; opacity: 0; }
        .motion-slide { animation: slideInRight 0.7s var(--ease-out-expo) forwards; opacity: 0; }

        .size-pill {
          min-width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 500;
          font-family: 'Inter', sans-serif;
          border: 1.5px solid rgba(0,0,0,0.1);
          background: white; color: #000;
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .size-pill:hover:not(.active):not(:disabled) { border-color: #000; }
        .size-pill.active { background: #000; border-color: #000; color: white; }
        .size-pill:disabled { opacity: 0.35; cursor: not-allowed; }

        .qty-pill {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(0,0,0,0.1);
          background: white; color: rgba(0,0,0,0.4);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .qty-pill:hover:not(:disabled) { border-color: #000; color: #000; }
        .qty-pill:disabled { opacity: 0.3; cursor: not-allowed; }

        .btn-primary {
          height: 48px;
          background: #000;
          color: white;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: none;
          transition: all 0.3s var(--ease-out-expo);
          cursor: pointer;
        }
        .btn-primary:hover:not(:disabled) { background: #1a1a1a; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

        .btn-secondary {
          height: 48px;
          background: white;
          color: #000;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1px solid rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .btn-secondary:hover { border-color: #000; }

        .skeleton-apple {
          background: linear-gradient(90deg, #f5f5f5 25%, #fafafa 50%, #f5f5f5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

        /* Thumbnail rail */
        .thumb-rail::-webkit-scrollbar { width: 0; height: 0; }
        .thumb-rail { -ms-overflow-style: none; scrollbar-width: none; }

        @media (prefers-reduced-motion: reduce) {
          .motion-fade, .motion-up, .motion-slide {
            animation: none !important; opacity: 1 !important; transform: none !important;
          }
        }
      `}</style>

      <AnnouncementBar />
      <Header />

      {/* ═════ DESKTOP ═════ */}
      <div className="hidden lg:block">
        <div className="max-w-[1200px] mx-auto px-8 pt-8 pb-16">
          <div className="grid grid-cols-12 gap-10">
            
            {/* LEFT: Image gallery (col-span-7) */}
            <div className="col-span-7 motion-fade" style={{ animationDelay: '0.1s' }}>
              <div className="flex gap-4 h-full">
                {/* Vertical thumbnail rail */}
                {images.length > 1 && (
                  <div className="thumb-rail flex flex-col gap-2 overflow-y-auto w-[72px] shrink-0 max-h-[600px]">
                    {images.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setImg(i)}
                        className={`w-[72px] h-[72px] overflow-hidden transition-all duration-300 ${
                          img === i 
                            ? 'ring-1 ring-black ring-offset-2 opacity-100' 
                            : 'opacity-40 hover:opacity-70'
                        }`}
                      >
                        <img 
                          src={src} 
                          alt="" 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main stage */}
                <div className="relative flex-1 bg-[#f8f8f8] aspect-square max-h-[600px]">
                  {!imageLoaded[img] && <div className="absolute inset-0 skeleton-apple" />}
                  <img
                    src={images[img]}
                    alt={product.name}
                    onLoad={() => handleImageLoad(img)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      imageLoaded[img] ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  
                  {product.badge && (
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-black text-white text-[10px] font-medium tracking-[0.1em] uppercase font-inter">
                      {product.badge}
                    </span>
                  )}
                  {lowStock && trackedStock && (
                    <span className="absolute top-4 right-4 px-3 py-1.5 bg-black text-white text-[10px] font-medium tracking-[0.1em] uppercase font-inter">
                      {stock} left
                    </span>
                  )}

                  {/* Nav arrows (only if >1 image) */}
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={() => setImg(Math.max(0, img - 1))} 
                        disabled={img === 0}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur flex items-center justify-center disabled:opacity-0 transition-opacity shadow-sm hover:bg-white"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setImg(Math.min(images.length - 1, img + 1))} 
                        disabled={img === images.length - 1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur flex items-center justify-center disabled:opacity-0 transition-opacity shadow-sm hover:bg-white"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Image counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/90 backdrop-blur text-[11px] font-medium text-black/60 font-inter tracking-wide">
                      {img + 1} / {images.length}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Details (col-span-5) */}
            <div className="col-span-5 motion-slide" style={{ animationDelay: '0.2s' }}>
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-black/40 mb-3 font-inter">
                {product.category}
              </p>
              
              <h1 className="text-[28px] font-semibold text-black leading-[1.15] tracking-tight mb-4 font-inter">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-6">
                {product.originalPrice && (
                  <span className="text-[16px] text-black/30 line-through font-light font-inter">
                    {formattedPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-[22px] font-semibold text-black font-inter">
                  {formattedPrice(price)}
                </span>
              </div>

              {/* Stock */}
              <div className="mb-6">
                {outOfStock ? (
                  <p className="flex items-center gap-1.5 text-[13px] text-black/40 font-inter">
                    <AlertCircle className="w-3.5 h-3.5" /> Out of stock
                  </p>
                ) : lowStock && trackedStock ? (
                  <p className="flex items-center gap-1.5 text-[13px] text-black font-inter">
                    <AlertCircle className="w-3.5 h-3.5" /> Only {stock} left
                  </p>
                ) : (
                  <p className="text-[13px] text-black/40 font-inter">In stock</p>
                )}
              </div>

              {/* Size */}
              {product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] text-black/40 font-medium tracking-wide font-inter uppercase">Size</span>
                    <span className="text-[11px] text-black font-medium font-inter">{size}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button 
                        key={s} 
                        onClick={() => { setSelectedSize(s); setQty(1); }}
                        className={`size-pill ${size === s ? 'active' : ''}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-black/10">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="qty-pill">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-11 text-center text-[13px] font-medium text-black font-inter">{qty}</span>
                  <button onClick={() => {
                    if (trackedStock && qty >= stock) { alert(`Max: ${stock}`); return; }
                    setQty(qty + 1);
                  }} disabled={trackedStock && qty >= stock} className="qty-pill">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button 
                  onClick={handleAdd} 
                  disabled={outOfStock || added}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {added ? (
                    <><Check className="w-4 h-4" /> Added</>
                  ) : (
                    <><ShoppingBag className="w-4 h-4" /> Add to Cart</>
                  )}
                </button>
              </div>

              {/* Share */}
              <button className="flex items-center gap-2 text-[11px] text-black/40 hover:text-black transition-colors mb-8 font-inter tracking-wide uppercase">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>

              {/* Description */}
              {product.description && (
                <div className="border-t border-black/5 pt-6">
                  <p className="text-[11px] text-black/40 font-medium tracking-wide mb-2 font-inter uppercase">Description</p>
                  <p className="text-[13px] text-black/60 leading-[1.7] font-inter">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Desktop trust */}
              <div className="border-t border-black/5 pt-6 mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Truck className="w-4 h-4 mx-auto mb-1.5 text-black/30" />
                  <p className="text-[10px] text-black/40 font-inter leading-tight">Free ship over $150</p>
                </div>
                <div className="text-center">
                  <Package className="w-4 h-4 mx-auto mb-1.5 text-black/30" />
                  <p className="text-[10px] text-black/40 font-inter leading-tight">Ships in 1–3 days</p>
                </div>
                <div className="text-center">
                  <Sparkles className="w-4 h-4 mx-auto mb-1.5 text-black/30" />
                  <p className="text-[10px] text-black/40 font-inter leading-tight">In stock at Northtown</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═════ MOBILE ═════ */}
      <div className="lg:hidden">
        <div className="px-5 pt-4 pb-10 max-w-md mx-auto">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] text-black/40 mb-4 font-inter motion-fade">
            <Link href="/" className="hover:text-black transition-colors">Shop</Link>
            <span className="text-black/20">/</span>
            <span className="text-black">{product.name}</span>
          </nav>

          {/* Main image */}
          <div className="relative mb-4 motion-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative aspect-square bg-[#f8f8f8]">
              {!imageLoaded[img] && <div className="absolute inset-0 skeleton-apple" />}
              <img
                src={images[img]}
                alt={product.name}
                onLoad={() => handleImageLoad(img)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded[img] ? 'opacity-100' : 'opacity-0'
                }`}
              />
              
              {product.badge && (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-black text-white text-[9px] font-medium tracking-[0.1em] uppercase font-inter">
                  {product.badge}
                </span>
              )}
              {lowStock && trackedStock && (
                <span className="absolute top-3 right-3 px-2.5 py-1 bg-black text-white text-[9px] font-medium tracking-[0.1em] uppercase font-inter">
                  {stock} left
                </span>
              )}

              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setImg(Math.max(0, img - 1))} 
                    disabled={img === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur flex items-center justify-center disabled:opacity-0 transition-opacity shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setImg(Math.min(images.length - 1, img + 1))} 
                    disabled={img === images.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur flex items-center justify-center disabled:opacity-0 transition-opacity shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="thumb-rail flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImg(i)}
                    className={`w-14 h-14 shrink-0 overflow-hidden transition-all duration-300 ${
                      img === i 
                        ? 'ring-1 ring-black ring-offset-1 opacity-100' 
                        : 'opacity-40'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {/* Dot indicators (only if no thumbnails fit well, or as supplement) */}
            {images.length > 1 && images.length <= 6 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {images.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setImg(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      img === i ? 'bg-black w-4' : 'bg-black/15 w-1'
                    }`} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="motion-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-black/40 mb-1 font-inter text-center">
              {product.category}
            </p>
            <h1 className="text-[22px] font-semibold text-black leading-[1.2] tracking-tight mb-3 font-inter text-center">
              {product.name}
            </h1>
            
            <div className="flex items-center justify-center gap-3 mb-5">
              {product.originalPrice && (
                <span className="text-[15px] text-black/30 line-through font-light font-inter">
                  {formattedPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-[20px] font-semibold text-black font-inter">
                {formattedPrice(price)}
              </span>
            </div>

            {/* Size */}
            {product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[11px] text-black/40 font-medium font-inter uppercase">Size</span>
                  <span className="text-[11px] text-black font-medium font-inter">{size}</span>
                </div>
                <div className="flex justify-center gap-2">
                  {product.sizes.map(s => (
                    <button 
                      key={s} 
                      onClick={() => { setSelectedSize(s); setQty(1); }}
                      className={`size-pill ${size === s ? 'active' : ''}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex justify-center mb-5">
              <div className="flex items-center border border-black/10">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="qty-pill">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-[13px] font-medium text-black font-inter">{qty}</span>
                <button onClick={() => {
                  if (trackedStock && qty >= stock) { alert(`Max: ${stock}`); return; }
                  setQty(qty + 1);
                }} disabled={trackedStock && qty >= stock} className="qty-pill">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <button 
              onClick={handleAdd} 
              disabled={outOfStock || added}
              className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
            >
              {added ? (
                <><Check className="w-4 h-4" /> Added to Cart</>
              ) : outOfStock ? (
                'Sold Out'
              ) : (
                <><ShoppingBag className="w-4 h-4" /> Add to Cart</>
              )}
            </button>

            <button className="flex items-center justify-center gap-2 text-[11px] text-black/40 hover:text-black transition-colors w-full mb-6 font-inter tracking-wide uppercase">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>

            {/* Trust icons */}
            <div className="border-t border-black/5 pt-5 mb-5 grid grid-cols-3 gap-3 text-center">
              <div>
                <Truck className="w-4 h-4 mx-auto mb-1 text-black/25" />
                <p className="text-[10px] text-black/40 font-inter leading-tight">Free ship over $150</p>
              </div>
              <div>
                <Package className="w-4 h-4 mx-auto mb-1 text-black/25" />
                <p className="text-[10px] text-black/40 font-inter leading-tight">Ships in 1–3 days</p>
              </div>
              <div>
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-black/25" />
                <p className="text-[10px] text-black/40 font-inter leading-tight">In stock at Northtown</p>
              </div>
            </div>

            {/* Category details */}
            <CategoryDetails category={product.category} />

            {/* Description */}
            {product.description && (
              <div className="border-t border-black/5 pt-5">
                <p className="text-[11px] text-black/40 font-medium tracking-wide mb-2 font-inter uppercase">About</p>
                <p className="text-[13px] text-black/60 leading-[1.7] font-inter">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-black/5 px-5 py-14 max-w-[1200px] mx-auto">
          <div className="text-center mb-10 motion-up">
            <p className="text-[10px] tracking-[0.2em] uppercase text-black/40 font-medium mb-2 font-inter">
              You May Also Like
            </p>
            <h2 className="text-[20px] font-semibold text-black tracking-tight font-inter">
              Complete Your Look
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p, i) => (
              <div key={p.id} className="motion-up" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      <ProductReviews productId={product.id} productName={product.name} />
      <RecentlyViewed excludeId={product.id} />
      <ChatWidget />
    </main>
  );
}

/* =========================================================
   Category-specific product info panels.
   ========================================================= */
function CategoryDetails({ category }: { category: string }) {
  const norm = category.toLowerCase().replace(/[^a-z]/g, '');
  const type: 'jewelry' | 'haircare' | 'skincare' | 'other' =
    norm.includes('jewelr') ? 'jewelry'
      : norm.includes('hair') ? 'haircare'
      : norm.includes('skin') || norm.includes('body') ? 'skincare'
      : 'other';

  if (type === 'other') return null;

  const sections = {
    jewelry: [
      { title: 'Materials', body: 'Hypoallergenic base metal, gold or silver-toned finish. Nickel- and lead-free. Individual pieces may vary — see the product description for exact composition.' },
      { title: 'Care Instructions', body: 'To keep your jewelry looking new: avoid contact with water, perfumes, lotions, and cleaning agents. Store each piece in a soft pouch away from other jewelry to prevent scratching. Clean gently with a soft, dry cloth.' },
      { title: 'Sizing & Fit', body: 'Measurements are noted in the product description where applicable. If you\'re between sizes, size up.' },
      { title: 'Sensitivity Note', body: 'While our jewelry is nickel- and lead-free, individuals with metal sensitivities should test wear briefly before extended use.' },
    ],
    haircare: [
      { title: 'Material & Fit', body: 'Premium satin construction to protect hair while you sleep. Adjustable band designed to stay in place without leaving marks. One size fits most adults.' },
      { title: 'Benefits', body: 'Reduces breakage and split ends · Preserves moisture and natural oils · Protects styles overnight · Minimizes friction against pillowcases.' },
      { title: 'How to Care for It', body: 'Hand wash in cold water with mild detergent. Air dry — do not tumble dry. Iron on low heat if needed. Avoid bleach or fabric softener.' },
      { title: 'Best For', body: 'All hair types and textures. Especially loved by those with natural, coily, curly, or protective styles.' },
    ],
    skincare: [
      { title: 'Ingredients', body: 'Formulated with natural, plant-based ingredients. Full ingredient list is on the product packaging — please review before use if you have known sensitivities.' },
      { title: 'How to Use', body: 'For African Black Soap: lather with warm water and apply to face or body, avoiding the eye area. Rinse thoroughly and follow with moisturizer. For Shea Butter: warm a small amount between your palms and apply to clean skin.' },
      { title: 'Storage', body: 'Store in a cool, dry place away from direct sunlight. Keep the container closed when not in use to preserve freshness.' },
      { title: 'Disclaimer', body: 'For external use only. Discontinue use if irritation occurs. Not intended to diagnose, treat, cure, or prevent any medical condition. If you are pregnant, nursing, or under medical care, consult your healthcare provider before use. Keep out of reach of children.' },
    ],
  };

  return (
    <div className="border-t border-black/5 pt-5 mb-5">
      <p className="text-[11px] text-black/40 font-medium tracking-wide mb-3 font-inter uppercase flex items-center gap-1.5">
        <Info className="w-3 h-3" /> Product Details
      </p>
      <div className="space-y-2">
        {sections[type].map((s) => (
          <details key={s.title} className="group border border-black/5 rounded">
            <summary className="cursor-pointer px-3 py-2.5 text-[12px] font-medium text-black font-inter flex items-center justify-between hover:bg-black/[0.02] transition-colors list-none">
              <span>{s.title}</span>
              <ChevronRight className="w-3 h-3 text-black/30 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="px-3 pb-3 text-[12px] text-black/60 leading-[1.7] font-inter">
              {s.body}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}