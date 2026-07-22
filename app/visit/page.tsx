'use client';

import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';
import { MapPin, Clock, Phone, Sparkles, Store, Calendar } from 'lucide-react';

/* =========================================================
   Visit Us — Northtown Mall (open) + Mall of America (Aug 10).
   Uses Google Maps embedded via query URL, no API key needed.
   ========================================================= */

const NORTHTOWN_QUERY = 'Northtown+Mall,+Blaine,+MN';
const MOA_QUERY = 'Mall+of+America,+Bloomington,+MN';

export default function VisitPage() {
  return (
    <main className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500&display=swap');
        .font-playfair{ font-family:'Playfair Display',serif; }
        .font-inter{ font-family:'Inter',sans-serif; }
      `}</style>

      <AnnouncementBar />
      <Header />

      <div className="max-w-6xl mx-auto px-5 py-14 md:py-20 font-inter">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#8b6914] font-medium mb-4">
            Our Locations
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-semibold text-[#1a1200] mb-4">
            Visit Us in Person
          </h1>
          <div className="w-12 h-[2px] mx-auto bg-gradient-to-r from-[#a8862a] via-[#e2c471] to-[#a8862a] mb-6" />
          <p className="text-[14px] text-[#5b5348] max-w-lg mx-auto leading-relaxed">
            Come see our jewelry, haircare, and skincare collections in person at our Minnesota locations.
          </p>
        </div>

        {/* Northtown Mall */}
        <section className="mb-16 md:mb-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-[10px] tracking-[0.24em] uppercase text-green-800 font-medium mb-5">
                <Sparkles size={11} /> Now Open
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#1a1200] italic mb-5">
                Northtown Mall
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex gap-3 text-[14px] text-[#5b5348]">
                  <MapPin size={18} className="shrink-0 text-[#8b6914] mt-0.5" />
                  <div>
                    <div className="text-[#1a1200] font-medium">398 Northtown Dr NE</div>
                    <div>Blaine, MN 55434</div>
                  </div>
                </div>
                <div className="flex gap-3 text-[14px] text-[#5b5348]">
                  <Clock size={18} className="shrink-0 text-[#8b6914] mt-0.5" />
                  <div>
                    <div className="text-[#1a1200] font-medium">Mall Hours</div>
                    <div>Mon–Sat: 10AM – 8PM</div>
                    <div>Sunday: 11AM – 6PM</div>
                    <div className="text-xs mt-1 text-[#8b6914]">Hours may vary on holidays</div>
                  </div>
                </div>
                <div className="flex gap-3 text-[14px] text-[#5b5348]">
                  <Phone size={18} className="shrink-0 text-[#8b6914] mt-0.5" />
                  <a href="tel:+16124878228" className="text-[#1a1200] font-medium hover:text-[#8b6914] transition-colors">
                    +1 (612) 487-8228
                  </a>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${NORTHTOWN_QUERY}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-[#1a1200] text-[#e2c471] text-[11px] font-medium tracking-[0.28em] uppercase rounded-full hover:bg-[#3d2a0e] transition-colors"
                >
                  Get Directions
                </a>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-3 border border-[#1a1200] text-[#1a1200] text-[11px] font-medium tracking-[0.28em] uppercase rounded-full hover:bg-[#1a1200] hover:text-[#e2c471] transition-colors"
                >
                  Shop Online
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative rounded-lg overflow-hidden border border-[#e5dfd0] shadow-sm aspect-[4/3]">
                <iframe
                  title="Northtown Mall map"
                  src={`https://www.google.com/maps?q=${NORTHTOWN_QUERY}&output=embed`}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mall of America */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
              <div className="relative rounded-lg overflow-hidden border border-[#e5dfd0] shadow-sm aspect-[4/3]">
                <iframe
                  title="Mall of America map"
                  src={`https://www.google.com/maps?q=${MOA_QUERY}&output=embed`}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf3de] border border-[#e2c471] text-[10px] tracking-[0.24em] uppercase text-[#5c4210] font-medium mb-5">
                <Calendar size={11} /> Opening August 10, 2026
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#1a1200] italic mb-5">
                Mall of America
              </h2>
              <p className="text-[14px] text-[#5b5348] leading-relaxed mb-6">
                We&apos;re expanding to one of America&apos;s most iconic retail destinations. Our new kiosk at Mall of America opens August 10, 2026 — join our list to be the first to know exact location details, opening events, and grand-opening offers.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex gap-3 text-[14px] text-[#5b5348]">
                  <MapPin size={18} className="shrink-0 text-[#8b6914] mt-0.5" />
                  <div>
                    <div className="text-[#1a1200] font-medium">Mall of America</div>
                    <div>60 E Broadway</div>
                    <div>Bloomington, MN 55425</div>
                    <div className="text-xs mt-1 text-[#8b6914]">Kiosk location coming soon</div>
                  </div>
                </div>
                <div className="flex gap-3 text-[14px] text-[#5b5348]">
                  <Store size={18} className="shrink-0 text-[#8b6914] mt-0.5" />
                  <div>
                    <div className="text-[#1a1200] font-medium">Grand Opening</div>
                    <div>Monday, August 10, 2026</div>
                    <div className="text-xs mt-1 text-[#8b6914]">
                      Show a MOA business card for 15% off — code MOA15
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/#subscribe"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.querySelector('.sinzu-signup');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-block px-6 py-3 bg-[#1a1200] text-[#e2c471] text-[11px] font-medium tracking-[0.28em] uppercase rounded-full hover:bg-[#3d2a0e] transition-colors"
              >
                Get Opening Updates
              </Link>
            </div>
          </div>
        </section>

        {/* CTA card */}
        <div className="mt-16 p-8 bg-[#faf3de] rounded-lg text-center">
          <h3 className="font-playfair text-xl italic text-[#1a1200] mb-3">
            Prefer to shop online?
          </h3>
          <p className="text-[14px] text-[#5b5348] mb-5">
            Everything on our shelves ships nationwide with real-time inventory from our kiosk.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-[#1a1200] text-[#e2c471] text-[11px] font-medium tracking-[0.28em] uppercase rounded-full hover:bg-[#3d2a0e] transition-colors"
          >
            Shop the Collection
          </Link>
        </div>
      </div>

      <ChatWidget />
    </main>
  );
}
