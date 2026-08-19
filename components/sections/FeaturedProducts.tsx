"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

/* ─────────────────────────────────────────────────────────────
   Which products appear here is set in Square: put [FEATURED] at
   the start of an item's description and it lands in this row.

   This used to hold four invented products with made-up prices,
   shown with working Add to Cart buttons because their fake IDs
   matched nothing in the catalog. Nothing is invented here now —
   if Square has no featured items the row falls back to real ones.
   ───────────────────────────────────────────────────────────── */

const MAX_FEATURED = 8;

/** Until anything is tagged, show a spread rather than the first four
 *  of whatever happens to sort first — nine net sponges in a row reads
 *  like a bug, not a selection. */
function fallbackSelection(products: Product[], limit: number): Product[] {
  const chosen: Product[] = [];
  const seenCategory = new Set<string>();

  for (const p of products) {
    if (seenCategory.has(p.category)) continue;
    seenCategory.add(p.category);
    chosen.push(p);
    if (chosen.length === limit) return chosen;
  }
  for (const p of products) {
    if (chosen.includes(p)) continue;
    chosen.push(p);
    if (chosen.length === limit) break;
  }
  return chosen;
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const [slide, setSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const tagged = products.filter((p) => p.featured);
  const featured = (tagged.length ? tagged : fallbackSelection(products, MAX_FEATURED)).slice(
    0,
    MAX_FEATURED
  );

  // Cards visible at once, and therefore how many pages the row needs.
  const perView = isMobile ? 2 : 4;
  const totalSlides = Math.max(1, Math.ceil(featured.length / perView));
  const maxSlide = totalSlides - 1;

  // Fewer cards than fit on screen: a fixed-width track would strand them
  // against the left edge with a gap where the missing cards would be. A
  // centred row is the honest layout for two or three featured items.
  const fitsWithoutCarousel = featured.length <= perView;

  // Check mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const nextSlide = useCallback(() => {
    setSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  }, [maxSlide]);

  const prevSlide = useCallback(() => {
    setSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  }, [maxSlide]);

  // Auto-advance every 6s — pointless, and a needless repaint, on one page.
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, totalSlides]);

  // Keep the page in range if the viewport changes under us.
  useEffect(() => {
    setSlide((s) => Math.min(s, maxSlide));
  }, [maxSlide]);

  // Touch / drag handling
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setTranslateX(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 80;
    if (translateX < -threshold) nextSlide();
    else if (translateX > threshold) prevSlide();
    setTranslateX(0);
  };

  const slideWidth = 100 / perView;

  // Catalog empty or still loading — show nothing rather than an empty frame.
  if (featured.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
          --ease-out-quart: cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .font-inter { font-family: 'Inter', -apple-system, sans-serif; }

        .motion-fade-up {
          animation: fadeInUp 0.7s var(--ease-out-expo) forwards;
          opacity: 0;
        }

        .carousel-track {
          transition: transform 0.6s var(--ease-out-expo);
          cursor: grab;
        }
        .carousel-track:active {
          cursor: grabbing;
        }
        .carousel-track.dragging {
          transition: none;
        }

        .progress-bar {
          height: 2px;
          background: #f5f5f7;
          position: relative;
          overflow: hidden;
        }
        .progress-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: #1d1d1f;
          transition: all 0.6s var(--ease-out-expo);
        }

        .nav-arrow {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e5e5e5;
          background: white;
          color: #1d1d1f;
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .nav-arrow:hover {
          border-color: #1d1d1f;
          background: #1d1d1f;
          color: white;
        }
        .nav-arrow:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        @media (prefers-reduced-motion: reduce) {
          .motion-fade-up { animation: none !important; opacity: 1 !important; }
          .carousel-track { transition: none !important; }
          .progress-fill { transition: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-10 md:mb-12 px-4 motion-fade-up">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#a8862a] font-medium mb-3 font-inter">
          Curated Selection
        </p>
        <h2 className="text-[28px] md:text-[32px] font-semibold text-[#1d1d1f] tracking-tight leading-[1.1] font-inter">
          Featured Products
        </h2>
        <div className="w-10 h-[2px] bg-gradient-to-r from-[#a8862a] via-[#e2c471] to-[#a8862a] mx-auto mt-4" />
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Desktop arrows */}
        <div
          className={`${
            fitsWithoutCarousel ? 'hidden' : 'hidden md:flex'
          } absolute left-0 right-0 top-1/2 -translate-y-1/2 z-10 justify-between pointer-events-none px-2`}
        >
          <button
            onClick={prevSlide}
            disabled={slide === 0}
            className="nav-arrow pointer-events-auto -translate-x-1/2"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            disabled={slide === maxSlide}
            className="nav-arrow pointer-events-auto translate-x-1/2"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Track */}
        <div className="overflow-hidden" ref={containerRef}>
          <div
            className={`carousel-track flex ${fitsWithoutCarousel ? 'justify-center' : ''} ${
              isDragging ? 'dragging' : ''
            }`}
            style={{
              transform: fitsWithoutCarousel
                ? undefined
                : `translateX(calc(-${slide * 100}% + ${translateX}px))`,
            }}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            {featured.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 px-2 md:px-3"
                style={{ width: `${slideWidth}%` }}
              >
                <div className="motion-fade-up" style={{ animationDelay: `${0.1 + index * 0.08}s` }}>
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress indicator — only when there is more than one page to reach.
            A "01 / 01" counter under a static row is furniture, not navigation. */}
        <div className={`mt-8 ${fitsWithoutCarousel ? 'hidden' : 'flex'} justify-center items-center gap-3`}>
          {/* Mobile dots */}
          <div className="flex md:hidden gap-2">
            {Array.from({ length: maxSlide + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`transition-all duration-300 ${
                  slide === i
                    ? "w-6 h-[2px] bg-[#1d1d1f]"
                    : "w-6 h-[2px] bg-[#d2d2d7]"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Desktop progress bar */}
          <div className="hidden md:block w-32 progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((slide + 1) / (maxSlide + 1)) * 100}%` }}
            />
          </div>

          <span className="text-[11px] text-[#86868b] font-medium tracking-wider font-inter ml-2">
            {String(slide + 1).padStart(2, "0")} / {String(maxSlide + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}