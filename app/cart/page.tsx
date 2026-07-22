'use client';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ChatWidget from '@/components/ChatWidget';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useCart } from '@/hooks/useCart';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar /><Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-serif text-2xl font-bold mb-6">Shopping Cart ({totalItems})</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link href="/shop" className="inline-block border border-gray-800 px-6 py-2 text-[11px] tracking-wider uppercase hover:bg-gray-900 hover:text-white transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-4 border-b border-gray-100">
                  <Link href={`/products/${item.id}`}>
                    <img src={item.image} alt={item.name} className="w-24 h-32 object-cover rounded" />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/products/${item.id}`}>
                      <h4 className="text-sm font-medium hover:text-yellow-700">{item.name}</h4>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Size: {item.size}</p>
                    <p className="text-sm font-semibold mt-1">${(item.price / 100).toFixed(2)} USD</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeItem(item.id, item.size)} className="ml-auto p-2 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Item total: ${((item.price * item.quantity) / 100).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2"><span className="text-sm text-gray-600">Subtotal</span><span className="text-sm font-semibold">${(totalPrice / 100).toFixed(2)} USD</span></div>
              <div className="flex justify-between mb-2"><span className="text-sm text-gray-600">Shipping</span><span className="text-sm text-gray-400">Calculated at checkout</span></div>
              <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-base font-bold">Estimated Total</span><span className="text-base font-bold">${(totalPrice / 100).toFixed(2)} USD</span></div>
            </div>

            <div className="space-y-3">
              <button onClick={() => router.push('/checkout')} className="w-full py-3 bg-gray-900 text-white text-sm font-medium tracking-wider uppercase rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={clearCart} className="w-full py-3 border border-gray-300 text-sm tracking-wider uppercase rounded hover:bg-gray-50 transition-colors">
                Clear Cart
              </button>
              <Link href="/shop" className="block w-full py-3 text-center text-sm text-gray-500 hover:text-gray-900">
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>

      <ChatWidget />
    </main>
  );
}
