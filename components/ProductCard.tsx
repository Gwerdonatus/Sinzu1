'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { ShoppingBag, Check } from 'lucide-react';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'One size');
  const [showSizes, setShowSizes] = useState(false);

  const variation = useMemo(
    () => product.variations?.find(v => v.name === selectedSize) ?? product.variations?.[0],
    [product.variations, selectedSize]
  );

  const displayPrice = variation?.price ?? product.price;
  const stock = variation?.inventory ?? product.inventory ?? 0;
  const trackedStock = stock < 999;
  const outOfStock = stock === 0;

  const handleAdd = () => {
    if (!variation || outOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: displayPrice,
      quantity: 1,
      image: product.image,
      size: selectedSize,
      variantId: variation.id,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const formattedPrice = (p: number) => `$${(p / 100).toFixed(2)}`;

  return (
    <div
      className="group motion-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="block">
        {/* SHARP SQUARE IMAGE — 1:1, no rounded corners */}
        <div className="relative w-full aspect-square overflow-hidden bg-[#f8f6f1] mb-3">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-shimmer" />
          )}
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-105' : 'scale-100'}`}
          />

          {/* Hover overlay with Quick View */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isHovered ? 'bg-black/10' : 'bg-transparent'
            }`}
          >
            <span
              className={`px-5 py-2 bg-white text-[10px] tracking-[0.2em] uppercase font-medium text-[#1a1a1a] transition-all duration-500 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              View
            </span>
          </div>

          {/* Badges — sharp, styled by type */}
          {product.badge && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 text-[9px] tracking-[0.15em] uppercase font-medium"
              style={
                product.badge === 'Best Seller'
                  ? { background: 'linear-gradient(135deg,#a8862a,#e2c471,#a8862a)', color: '#1a1200' }
                  : product.badge === 'New'
                  ? { background: '#faf3de', color: '#5c4210', border: '1px solid #e2c471' }
                  : { background: '#1a1a1a', color: '#fff' }
              }
            >
              {product.badge}
            </span>
          )}
          {trackedStock && stock <= 5 && stock > 0 && (
            <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#c9a227] text-white text-[9px] tracking-[0.1em] uppercase font-medium">
              {stock} left
            </span>
          )}
          {outOfStock && (
            <span className="absolute top-3 right-3 px-2 py-0.5 bg-gray-400 text-white text-[9px] tracking-[0.1em] uppercase font-medium">
              Sold Out
            </span>
          )}
        </div>
      </Link>

      {/* Clean text block */}
      <div className="px-0.5">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a227] font-medium mb-1 font-inter">
          {product.category || 'SINZULLC'}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-[13px] font-medium text-black leading-snug mb-1 line-clamp-2 group-hover:text-[#c9a227] transition-colors duration-300 font-playfair">
            {product.name}
          </h3>
        </Link>

        {/* Subtle star row — real ratings load on the product page */}
        <div className="flex items-center gap-1 mb-2" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="text-[10px]" style={{ color: n <= 5 ? '#c9a227' : '#e5e5e5' }}>★</span>
          ))}
          <span className="text-[10px] text-black/60 ml-1 font-inter">Reviews</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.originalPrice && (
            <span className="text-[12px] text-gray-300 line-through font-light">
              {formattedPrice(product.originalPrice)}
            </span>
          )}
          <span className="text-[13px] font-medium text-black font-inter">
            {formattedPrice(displayPrice)} <span className="text-gray-300 font-light">USD</span>
          </span>
        </div>

        {/* Size selector — minimal */}
        {product.sizes && product.sizes.length > 1 && (
          <div className="mb-3">
            <button
              onClick={() => setShowSizes(!showSizes)}
              className="text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-[#c9a227] transition-colors font-inter"
            >
              Size: {selectedSize} {showSizes ? '−' : '+'}
            </button>
            {showSizes && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => { setSelectedSize(s); setShowSizes(false); }}
                    className={`text-[10px] px-2.5 py-1 border transition-all duration-200 font-inter ${
                      selectedSize === s
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 text-gray-500 hover:border-[#c9a227] hover:text-[#c9a227]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add to Cart — sharp, no radius */}
        <button
          onClick={handleAdd}
          disabled={outOfStock || added}
          className={`w-full py-2.5 text-[10px] tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2 transition-all duration-300 font-inter ${
            added
              ? 'bg-[#c9a227] text-white'
              : outOfStock
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-black text-white hover:bg-[#c9a227] hover:text-black'
          }`}
        >
          {added ? (
            <><Check className="w-3 h-3" /> Added</>
          ) : outOfStock ? (
            'Sold Out'
          ) : (
            <><ShoppingBag className="w-3 h-3" /> Add to Cart</>
          )}
        </button>

        {/* Stock indicator */}
        <p className={`text-[10px] mt-2 tracking-wide font-inter ${
          outOfStock ? 'text-gray-300' : trackedStock && stock <= 5 ? 'text-[#c9a227]' : 'text-green-600'
        }`}>
          {outOfStock ? 'Out of stock' : trackedStock && stock <= 5 ? `${stock} left` : 'In stock'}
        </p>
      </div>
    </div>
  );
}