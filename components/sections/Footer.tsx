"use client";

import { Instagram, Facebook, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="relative text-[#1a1200] overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600&family=Inter:wght@200;300;400;500&display=swap');

        @keyframes goldShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .font-editorial { font-family: 'Cormorant Garamond', 'Georgia', serif; }
        .font-body { font-family: 'Inter', 'Helvetica Neue', sans-serif; }

        .gold-shine-text {
          background-image: linear-gradient(
            100deg,
            #7a5c1e 0%, #c9a227 15%, #f5e7a3 30%, #fffdf0 40%, #f5e7a3 50%,
            #d4af37 62%, #8b6914 75%, #d4af37 88%, #7a5c1e 100%
          );
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: goldShimmer 6s ease-in-out infinite alternate;
        }

        .pay-icon {
          height: 22px;
          filter: brightness(0) invert(0.1);
          opacity: 0.55;
        }
      `}</style>

      {/* Base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #5c3d00 0%, #8B6914 20%, #C9A227 40%, #F5E7A3 50%, #C9A227 60%, #8B6914 80%, #5c3d00 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(110deg, transparent 30%, rgba(255,253,240,0.35) 45%, rgba(245,231,163,0.25) 50%, rgba(255,253,240,0.35) 55%, transparent 70%)",
          backgroundSize: "250% 100%",
          animation: "goldShimmer 8s ease-in-out infinite",
        }}
      />
      <div className="relative z-10 h-[1px] bg-gradient-to-r from-transparent via-[#fffdf0]/40 to-transparent" />

      <div className="relative z-10 px-6 py-16 max-w-[1200px] mx-auto">
        {/* Top: 4-column info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-14">
          {/* Shop */}
          <div>
            <h3 className="font-body text-[10px] font-medium tracking-[0.3em] uppercase text-[#1a1200]/70 mb-6">Shop</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Shop All', href: '/shop' },
                { label: 'Jewelry', href: '/collections/jewelry' },
                { label: 'Haircare', href: '/collections/haircare' },
                { label: 'Skincare', href: '/collections/skincare' },
                { label: 'Best Sellers', href: '/collections/best-sellers' },
                { label: 'Sale', href: '/collections/sale' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-body text-[13px] font-light text-[#1a1200]/70 hover:text-[#1a1200] transition-colors duration-500 w-fit tracking-wide"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-body text-[10px] font-medium tracking-[0.3em] uppercase text-[#1a1200]/70 mb-6">Company</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Visit Our Stores', href: '/visit' },
                { label: 'Mall of America', href: '/visit' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Contact Us', href: '/contact' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-body text-[13px] font-light text-[#1a1200]/70 hover:text-[#1a1200] transition-colors duration-500 w-fit tracking-wide"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-body text-[10px] font-medium tracking-[0.3em] uppercase text-[#1a1200]/70 mb-6">Help</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Shipping Info', href: '/shipping-info' },
                { label: 'Returns & Refunds', href: '/refund' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Privacy Policy', href: '/terms' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-body text-[13px] font-light text-[#1a1200]/70 hover:text-[#1a1200] transition-colors duration-500 w-fit tracking-wide"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-body text-[10px] font-medium tracking-[0.3em] uppercase text-[#1a1200]/70 mb-6">Contact</h3>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-start gap-2 text-[12px] text-[#1a1200]/75 leading-relaxed">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-[#1a1200]/85">Northtown Mall</div>
                  <div>Blaine, MN 55434</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-[12px] text-[#1a1200]/75 leading-relaxed">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-[#1a1200]/85">Mall of America</div>
                  <div>Opens Aug 10, 2026</div>
                </div>
              </div>
              <a href="tel:+16124878228" className="flex items-center gap-2 text-[13px] text-[#1a1200]/80 hover:text-[#1a1200] transition-colors">
                <Phone size={14} />+1 (612) 487-8228
              </a>
              <a href="mailto:hello@sinzu.shop" className="flex items-center gap-2 text-[13px] text-[#1a1200]/80 hover:text-[#1a1200] transition-colors">
                <Mail size={14} /> hello@sinzu.shop
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mb-12 pb-12 border-b border-[#1a1200]/15">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-md">
              <h3 className="font-editorial text-2xl md:text-3xl italic mb-2 text-[#1a1200]">
                Join The Community
              </h3>
              <p className="font-body text-[13px] text-[#1a1200]/70 leading-relaxed">
                Get 10% off your first order with code <strong>WELCOME10</strong> when you subscribe.
              </p>
            </div>
            <form onSubmit={subscribe} className="flex-1 max-w-md w-full">
              <div className="flex border-b border-[#1a1200]/30 pb-1.5">
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className="flex-1 bg-transparent font-body text-[13px] placeholder:text-[#1a1200]/40 focus:outline-none text-[#1a1200] py-1 tracking-wide"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  aria-label="Subscribe"
                  className="w-9 h-9 flex items-center justify-center hover:opacity-60 transition-opacity"
                >
                  <ArrowRight size={16} className="text-[#1a1200]/70" />
                </button>
              </div>
              {status === 'success' && (
                <p className="text-[11px] text-[#1a1200]/70 mt-2">Welcome — check your inbox for your code.</p>
              )}
              {status === 'error' && (
                <p className="text-[11px] text-[#7a1e1e] mt-2">Something went wrong — please try again.</p>
              )}
            </form>
          </div>
        </div>

        {/* Brand mark + social + payment icons */}
        <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
          <div>
            <div className="font-editorial text-4xl md:text-5xl tracking-[0.12em] gold-shine-text">
              $INZU
            </div>
            <p className="font-body text-[11px] font-light text-[#1a1200]/55 tracking-[0.14em] mt-1">
              @sinzu.llc
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook"
              className="w-10 h-10 rounded-full border border-[#1a1200]/25 flex items-center justify-center hover:border-[#1a1200]/60 hover:bg-[#1a1200]/5 transition-all duration-500">
              <Facebook size={14} className="text-[#1a1200]/70" />
            </Link>
            <Link href="https://instagram.com/sinzu.llc" target="_blank" aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-[#1a1200]/25 flex items-center justify-center hover:border-[#1a1200]/60 hover:bg-[#1a1200]/5 transition-all duration-500">
              <Instagram size={14} className="text-[#1a1200]/70" />
            </Link>
          </div>

          <div className="flex md:justify-end items-center gap-2 flex-wrap">
            {/* SVG payment method badges */}
            {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'Discover'].map((name) => (
              <span
                key={name}
                title={name}
                className="text-[9px] font-medium tracking-[0.14em] uppercase px-2.5 py-1.5 rounded border border-[#1a1200]/25 text-[#1a1200]/65 bg-[#1a1200]/5"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1a1200]/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-[10px] font-light text-[#1a1200]/50 tracking-[0.14em]">
            © {new Date().getFullYear()} SINZU LLC · A Minnesota-registered brand · All rights reserved.
          </p>
          <p className="font-body text-[10px] font-light text-[#1a1200]/50 tracking-[0.14em]">
            Payments secured by <strong>Square</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
