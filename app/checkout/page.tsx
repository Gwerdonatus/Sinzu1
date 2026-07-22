'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ChatWidget from '@/components/ChatWidget';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useCart } from '@/hooks/useCart';
import { SHIPPING_METHODS, calcShippingCost, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';
import { CreditCard, Truck, Shield, Check, AlertCircle, Loader2, Tag, X } from 'lucide-react';

declare global {
  interface Window {
    Square?: any;
  }
}

const SQUARE_APP_ID = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || '';
const SQUARE_LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '';
const SQUARE_ENV = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || 'sandbox';
const SDK_URL =
  SQUARE_ENV === 'production'
    ? 'https://web.squarecdn.com/v1/square.js'
    : 'https://sandbox.web.squarecdn.com/v1/square.js';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  variantId: string;
};

type ShippingMethod = {
  id: string;
  label: string;
  description: string;
  kind: 'SHIPMENT' | 'PICKUP';
  timeline: string[];
};

type SuccessData = {
  receiptUrl?: string;
  orderId?: string;
  charged?: number;
  subtotal?: number;
  shipping?: number;
  discount?: number;
  discountCode?: string;
  method?: ShippingMethod;
  items?: CartItem[];
  address?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
};

const inputClass =
  'w-full px-3 py-2.5 bg-white border border-black/10 rounded text-sm focus:outline-none focus:border-black/30 transition-all';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const [card, setCard] = useState<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const [shippingMethodId, setShippingMethodId] = useState(SHIPPING_METHODS[0].id);
  const [addr, setAddr] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  const [discountInput, setDiscountInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    description: string;
    amountCents: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);

  const shippingCost = useMemo(
    () => calcShippingCost(shippingMethodId, totalPrice),
    [shippingMethodId, totalPrice]
  );
  const discountAmount = appliedDiscount?.amountCents ?? 0;
  const orderTotal = Math.max(0, totalPrice - discountAmount) + shippingCost;

  const applyDiscount = async () => {
    if (!discountInput.trim()) return;
    setDiscountLoading(true);
    setDiscountError('');
    try {
      const res = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountInput,
          items: items.map((i) => ({ variationId: i.variantId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDiscountError(data.error || 'Invalid code');
        return;
      }
      setAppliedDiscount({
        code: data.code,
        description: data.description,
        amountCents: data.discountCents,
      });
      setDiscountInput('');
    } catch {
      setDiscountError('Could not apply code. Please try again.');
    } finally {
      setDiscountLoading(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountError('');
  };

  const setField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddr((a) => ({ ...a, [field]: e.target.value }));

  useEffect(() => {
    if (window.Square) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError('Failed to load payment system. Please refresh the page.');
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !window.Square || items.length === 0 || card) return;

    const initCard = async () => {
      try {
        const payments = window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
        const cardInstance = await payments.card();
        await cardInstance.attach('#card-container');
        setCard(cardInstance);
      } catch (err: any) {
        console.error('Square card init error:', err);
        setError('Payment system initialization failed. Please refresh.');
      }
    };

    initCard();
  }, [scriptLoaded, items.length, card]);

  const validateShipping = () => {
    const method = SHIPPING_METHODS.find(m => m.id === shippingMethodId);
    const isPickup = method?.kind === 'PICKUP';

    const required: [string, string][] = isPickup
      ? [
          [addr.firstName, 'first name'], [addr.lastName, 'last name'],
          [addr.email, 'email'], [addr.phone, 'phone number'],
        ]
      : [
          [addr.firstName, 'first name'], [addr.lastName, 'last name'], [addr.email, 'email'],
          [addr.addressLine1, 'street address'], [addr.city, 'city'], [addr.state, 'state'],
          [addr.postalCode, 'postal code'], [addr.country, 'country'],
        ];
    for (const [value, label] of required) {
      if (!value.trim()) return `Please enter your ${label}`;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addr.email)) return 'Please enter a valid email address';
    return null;
  };

  const handlePayment = useCallback(async () => {
    if (!card) {
      setError('Payment system not ready. Please wait a moment.');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }
    const shippingError = validateShipping();
    if (shippingError) {
      setError(shippingError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await card.tokenize();
      if (result.status !== 'OK') {
        setError(result.errors?.[0]?.message || 'Card validation failed');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/square/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: result.token,
          items: items.map((i) => ({ variationId: i.variantId, quantity: i.quantity })),
          shippingMethodId,
          shippingAddress: addr,
          discountCode: appliedDiscount?.code,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || 'Payment failed. Please try again.');
        setLoading(false);
        return;
      }

      const chosenMethod = SHIPPING_METHODS.find((m) => m.id === shippingMethodId)!;
      setSuccess({
        receiptUrl: data.receiptUrl,
        orderId: data.orderId,
        charged: data.charged,
        subtotal: data.subtotal,
        shipping: data.shipping,
        discount: data.discount,
        discountCode: data.discountCode,
        method: chosenMethod,
        items: [...items],
        address: { ...addr },
      });
      clearCart();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [card, items, shippingMethodId, addr, clearCart, appliedDiscount]);

  if (items.length === 0 && !success) {
    return (
      <main className="min-h-screen bg-white">
        <AnnouncementBar /><Header />
        <div className="flex flex-col items-center justify-center h-[60vh] px-4">
          <AlertCircle className="w-12 h-12 text-black/10 mb-4" />
          <h2 className="font-serif text-xl mb-2">Your cart is empty</h2>
          <p className="text-sm text-black/40 mb-4">Add some items before checking out</p>
          <button onClick={() => router.push('/shop')} className="border border-black px-6 py-2 text-[11px] tracking-wider uppercase hover:bg-black hover:text-white transition-all">
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  if (success) {
    const orderShort = success.orderId ? success.orderId.slice(-8).toUpperCase() : '';
    const isPickup = success.method?.kind === 'PICKUP';
    return (
      <main className="min-h-screen bg-white">
        <AnnouncementBar /><Header />
        <div className="max-w-2xl mx-auto px-4 py-10 md:py-14">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-black rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-black mb-2">Order Confirmed</h1>
            <p className="text-sm text-black/50">Thank you, {success.address?.firstName}. Your order is on the way.</p>
          </div>

          <div className="bg-black text-white rounded-lg p-5 mb-6 text-center">
            <p className="text-[10px] tracking-[0.32em] uppercase opacity-50 mb-1">Order Number</p>
            <p className="text-2xl font-serif tracking-[0.15em] font-medium">#{orderShort}</p>
            <p className="text-xs opacity-50 mt-2">Save this for your records</p>
          </div>

          <div className="border border-black/10 bg-black/[0.02] rounded-lg p-4 mb-6 flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 rounded-full bg-black flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-black mb-0.5">Check your email</p>
              <p className="text-xs text-black/60 leading-relaxed">
                We&apos;ve sent a full confirmation to <strong className="text-black">{success.address?.email}</strong>. If you don&apos;t see it in a few minutes, check your spam folder.
              </p>
            </div>
          </div>

          <div className="border border-black/10 rounded-lg p-5 mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4" /> What Happens Next
            </h3>
            <ol className="space-y-4">
              {(success.method?.timeline || []).map((step: string, i: number) => (
                <li key={i} className="flex gap-3">
                  <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                    i === 0 ? 'bg-black text-white' : 'bg-black/5 text-black/40'
                  }`}>
                    {i === 0 ? <Check className="w-3 h-3" strokeWidth={3} /> : i + 1}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className={`text-sm ${i === 0 ? 'text-black font-medium' : 'text-black/50'}`}>
                      {step}
                    </p>
                    {i === 0 && (
                      <p className="text-[11px] text-black/40 mt-0.5">Just now</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="border border-black/10 rounded-lg p-5 mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {success.items?.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">{item.name}</p>
                    <p className="text-xs text-black/40">{item.size} · Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-black">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-black/10 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-black/50">Subtotal</span>
                <span className="text-black">${((success.subtotal || 0) / 100).toFixed(2)}</span>
              </div>
              {(success.discount || 0) > 0 && (
                <div className="flex justify-between text-black font-medium">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {success.discountCode}</span>
                  <span>− ${((success.discount || 0) / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-black/50">{success.method?.label}</span>
                <span className="text-black">
                  {(success.shipping || 0) === 0 ? <span className="text-black font-medium">Free</span> : `$${((success.shipping || 0) / 100).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-black/10 text-base">
                <span>Total charged</span>
                <span>${((success.charged || 0) / 100).toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          {success.address && (
            <div className="border border-black/10 rounded-lg p-5 mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
                {isPickup ? 'Pickup Location' : 'Ships To'}
              </h3>
              {isPickup ? (
                <div className="text-sm text-black/60 leading-relaxed">
                  <p className="font-semibold text-black">SINZU at Northtown Mall</p>
                  <p>398 Northtown Dr NE</p>
                  <p>Blaine, MN 55434</p>
                  <p className="text-xs text-black/40 mt-2">Mall hours: Mon–Sat 10AM–8PM · Sun 11AM–6PM</p>
                  <p className="text-xs text-black/40 mt-3 pt-3 border-t border-black/5">
                    <strong className="text-black">Contact:</strong> {success.address.firstName} {success.address.lastName} · {success.address.email} · {success.address.phone}
                  </p>
                </div>
              ) : (
                <div className="text-sm text-black/60 leading-relaxed">
                  <p className="font-semibold text-black">{success.address.firstName} {success.address.lastName}</p>
                  <p>{success.address.addressLine1}{success.address.addressLine2 && `, ${success.address.addressLine2}`}</p>
                  <p>{success.address.city}, {success.address.state} {success.address.postalCode}</p>
                  <p>{success.address.country}</p>
                </div>
              )}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {success.receiptUrl && (
              <a
                href={success.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center border border-black text-black px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-black hover:text-white transition-all rounded-full"
              >
                View Square Receipt
              </a>
            )}
            <button
              onClick={() => router.push('/shop')}
              className="text-center bg-black text-white px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-black/80 transition-all rounded-full"
            >
              Continue Shopping
            </button>
          </div>

          <div className="bg-black/[0.02] rounded-lg p-5 text-center">
            <p className="text-sm text-black/60 mb-3">Need help with your order?</p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a href="tel:+16124878228" className="text-black underline hover:text-black/60 transition-colors">
                +1 (612) 487-8228
              </a>
              <a href="mailto:hello@sinzu.shop" className="text-black underline hover:text-black/60 transition-colors">
                hello@sinzu.shop
              </a>
              <a href="/faq" className="text-black underline hover:text-black/60 transition-colors">
                Read FAQ
              </a>
            </div>
            <p className="text-[11px] text-black/40 mt-4">
              Reference order <strong className="text-black">#{orderShort}</strong> when you contact us.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar /><Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-serif text-2xl font-bold mb-6 text-center">Checkout</h1>

        <div className="bg-black/[0.02] rounded-lg p-4 mb-6">
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider">Order Summary</h2>
          <div className="space-y-3">
            {items.map(item => (
              <div key={`${item.id}-${item.size}`} className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  <p className="text-xs text-black/40">Size: {item.size} × {item.quantity}</p>
                  <p className="text-sm font-semibold">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-black/10 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-black/50">Subtotal</span><span>${(totalPrice / 100).toFixed(2)} USD</span></div>
            {appliedDiscount && (
              <div className="flex justify-between text-sm">
                <span className="text-black font-medium flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> {appliedDiscount.code}
                </span>
                <span className="text-black font-medium">− ${(appliedDiscount.amountCents / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-black/50">Shipping</span>
              <span>{shippingCost === 0 ? <span className="text-black font-medium">Free</span> : `$${(shippingCost / 100).toFixed(2)} USD`}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-black/10">
              <span>Total</span>
              <span>${(orderTotal / 100).toFixed(2)} USD</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-black/10">
            {appliedDiscount ? (
              <div className="flex items-center justify-between p-3 bg-black/[0.03] border border-black/10 rounded">
                <div className="text-xs">
                  <div className="font-medium text-black">
                    <Tag className="w-3.5 h-3.5 inline mr-1" />
                    {appliedDiscount.code} applied
                  </div>
                  <div className="text-black/50 mt-0.5">{appliedDiscount.description}</div>
                </div>
                <button
                  onClick={removeDiscount}
                  className="text-black/40 hover:text-black transition-colors p-1"
                  aria-label="Remove discount"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    className={`${inputClass} flex-1 uppercase`}
                    placeholder="Discount code"
                    value={discountInput}
                    onChange={(e) => { setDiscountInput(e.target.value); setDiscountError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && applyDiscount()}
                    disabled={discountLoading}
                  />
                  <button
                    onClick={applyDiscount}
                    disabled={discountLoading || !discountInput.trim()}
                    className="px-4 py-2 bg-black text-white text-[11px] font-medium tracking-[0.2em] uppercase rounded hover:bg-black/80 transition-colors disabled:opacity-50"
                  >
                    {discountLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                  </button>
                </div>
                {discountError && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {discountError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-6 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-black/40"><Shield className="w-4 h-4" />Secure</div>
          <div className="flex items-center gap-1.5 text-xs text-black/40"><Truck className="w-4 h-4" />Fast Shipping</div>
          <div className="flex items-center gap-1.5 text-xs text-black/40"><CreditCard className="w-4 h-4" />Encrypted</div>
        </div>

        {(() => {
          const selectedMethod = SHIPPING_METHODS.find(m => m.id === shippingMethodId);
          const isPickup = selectedMethod?.kind === 'PICKUP';
          return (
            <div className="border border-black/10 rounded-lg p-4 mb-4">
              <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4" /> {isPickup ? 'Your Contact Info' : 'Shipping Address'}
              </h2>
              {isPickup && (
                <p className="text-xs text-black/40 mb-3">
                  We&apos;ll email you when your order is ready to pick up at Northtown Mall.
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <input className={inputClass} placeholder="First name *" value={addr.firstName} onChange={setField('firstName')} autoComplete="given-name" />
                <input className={inputClass} placeholder="Last name *" value={addr.lastName} onChange={setField('lastName')} autoComplete="family-name" />
                <input className={`${inputClass} col-span-2`} type="email" placeholder="Email *" value={addr.email} onChange={setField('email')} autoComplete="email" />
                <input className={`${inputClass} col-span-2`} type="tel" placeholder={isPickup ? "Phone * (we'll text when ready)" : "Phone (optional)"} value={addr.phone} onChange={setField('phone')} autoComplete="tel" />
                {!isPickup && (
                  <>
                    <input className={`${inputClass} col-span-2`} placeholder="Street address *" value={addr.addressLine1} onChange={setField('addressLine1')} autoComplete="address-line1" />
                    <input className={`${inputClass} col-span-2`} placeholder="Apartment, suite, etc. (optional)" value={addr.addressLine2} onChange={setField('addressLine2')} autoComplete="address-line2" />
                    <input className={inputClass} placeholder="City *" value={addr.city} onChange={setField('city')} autoComplete="address-level2" />
                    <input className={inputClass} placeholder="State / Province *" value={addr.state} onChange={setField('state')} autoComplete="address-level1" />
                    <input className={inputClass} placeholder="Postal code *" value={addr.postalCode} onChange={setField('postalCode')} autoComplete="postal-code" />
                    <input className={inputClass} placeholder="Country (e.g. US) *" value={addr.country} onChange={setField('country')} maxLength={2} autoComplete="country" />
                  </>
                )}
              </div>
            </div>
          );
        })()}

        <div className="border border-black/10 rounded-lg p-4 mb-4">
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider">Delivery Method</h2>
          <div className="space-y-2">
            {SHIPPING_METHODS.map((method) => {
              const cost = calcShippingCost(method.id, totalPrice);
              const selected = shippingMethodId === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setShippingMethodId(method.id)}
                  className={`w-full flex items-center justify-between p-3 rounded border text-left transition-all ${
                    selected ? 'border-black bg-black/[0.02]' : 'border-black/10 hover:border-black/30'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${selected ? 'border-black' : 'border-black/20'}`}>
                      {selected && <span className="w-2 h-2 rounded-full bg-black" />}
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{method.label}</span>
                      <span className="block text-xs text-black/40">{method.description}</span>
                    </span>
                  </span>
                  <span className="text-sm font-semibold">
                    {cost === 0 ? <span className="text-black">Free</span> : `$${(cost / 100).toFixed(2)}`}
                  </span>
                </button>
              );
            })}
          </div>
          {totalPrice < FREE_SHIPPING_THRESHOLD && (
            <p className="text-[11px] text-black/30 mt-2">
              Free standard shipping on orders over ${(FREE_SHIPPING_THRESHOLD / 100).toFixed(0)}
            </p>
          )}
        </div>

        <div className="border border-black/10 rounded-lg p-4 mb-4">
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Payment
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div id="card-container" className="min-h-[120px] mb-4" />

          {!scriptLoaded && (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-black/20" />
              <p className="text-sm text-black/40">Loading secure payment form...</p>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading || !card}
            className="w-full py-3 bg-black text-white text-sm font-medium tracking-wider uppercase rounded hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : `Pay $${(orderTotal / 100).toFixed(2)} USD`}
          </button>
        </div>

        <p className="text-xs text-black/30 text-center">
          By placing this order, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      <ChatWidget />
    </main>
  );
}