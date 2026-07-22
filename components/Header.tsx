'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { items, totalItems, totalPrice, isOpen, setIsOpen, updateQuantity, removeItem } = useCart();

  const runSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setSearchQuery('');
  };

  const menuItems = [
    { name: 'Shop All', href: '/shop' },
    { name: 'Jewelry', href: '/collections/jewelry' },
    { name: 'Haircare', href: '/collections/haircare' },
    { name: 'Skincare', href: '/collections/skincare' },
    { name: 'Best Sellers', href: '/collections/best-sellers' },
    { name: 'Mall of America', href: '/visit' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
  ];

  const infoItems = [
    { name: 'Contact', href: '/contact' },
    { name: 'Shipping Info', href: '/shipping-info' },
    { name: 'Returns & Refunds', href: '/refund' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white mb-4">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-1 flex justify-start">
            <button onClick={() => setMenuOpen(true)} className="p-2 hover:bg-gray-50 rounded-lg">
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <Link href="/">
            <img src="/images/sinzu-logo.png" alt="SINZU LLC" className="logo-spin w-24 h-24 object-contain" />
          </Link>

          <div className="flex-1 flex justify-end items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-gray-50 rounded-lg">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-gray-50 rounded-lg relative">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="px-4 pb-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              autoFocus
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {menuOpen && <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} />}
      <div className={`mobile-menu-panel ${menuOpen ? 'open' : ''}`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-serif text-lg font-semibold">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-50 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick links</h3>
            <ul className="space-y-1">
              {menuItems.map(item => (
                <li key={item.name}>
                  <Link href={item.href} onClick={() => setMenuOpen(false)} className="block py-2 px-3 text-sm hover:bg-gray-50 rounded-lg">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Info</h3>
            <ul className="space-y-1">
              {infoItems.map(item => (
                <li key={item.name}>
                  <Link href={item.href} onClick={() => setMenuOpen(false)} className="block py-2 px-3 text-sm hover:bg-gray-50 rounded-lg">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Our mission</h3>
            <p className="text-sm text-gray-600 leading-relaxed px-3">Our #1 Priority is to make Sinzu Babes feel their best self in our stylish wear!</p>
          </div>
          <div className="border-t border-gray-100 pt-4 mt-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Subscribe to our newsletter</h3>
            <div className="flex gap-2 px-3">
              <input type="email" placeholder="Email" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" />
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">→</button>
            </div>
          </div>
        </nav>
      </div>

      {/* Cart Drawer */}
      {isOpen && <div className="cart-overlay" onClick={() => setIsOpen(false)} />}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <span className="font-serif text-lg font-semibold">Your Cart ({totalItems})</span>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-50 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <button onClick={() => setIsOpen(false)} className="mt-4 text-sm text-yellow-600 underline">Continue Shopping</button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item, idx) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3 pb-4 border-b border-gray-100">
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Size: {item.size}</p>
                      <p className="text-sm font-semibold mt-1">${(item.price / 100).toFixed(2)} USD</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeItem(item.id, item.size)} className="ml-auto p-1 text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 sticky bottom-0 bg-white">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-semibold">${(totalPrice / 100).toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="text-sm text-gray-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between mb-4 pt-2 border-t border-gray-100">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-base font-bold">${(totalPrice / 100).toFixed(2)} USD</span>
                </div>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-3 bg-gray-900 text-white text-sm font-medium tracking-wider uppercase rounded hover:bg-gray-800 transition-colors">
                    Checkout
                  </button>
                </Link>
                <button onClick={() => setIsOpen(false)} className="w-full py-3 mt-2 border border-gray-300 text-sm tracking-wider uppercase rounded hover:bg-gray-50 transition-colors">
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}