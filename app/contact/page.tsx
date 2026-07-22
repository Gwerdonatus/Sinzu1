'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ChatWidget from '@/components/ChatWidget';
import AnnouncementBar from '@/components/AnnouncementBar';
import { Clock, Mail, Instagram, ArrowRight, Plus, MapPin, Navigation } from 'lucide-react';

/* =========================================================
   SINZU — Contact page

   ⚠️ REPLACE BEFORE SHIPPING:
   - STORE_LOCATIONS below: put in the real mall name(s),
     address(es), and a Google Maps query for each. The
     "mapQuery" just needs to be whatever you'd type into
     Google Maps search — a full address or "Mall Name, City"
     both work fine with the embed used here.
   ========================================================= */

const STORE_LOCATIONS = [
  {
    name: 'SINZU — Flagship',
    address: 'Replace with mall name & full address',
    mapQuery: 'Replace with mall name, city, country',
  },
  {
    name: 'SINZU — Second Location',
    address: 'Replace with mall name & full address',
    mapQuery: 'Replace with mall name, city, country',
  },
];

/** The wordmark: S becomes a dollar sign. This is the one place gold is
 *  allowed to shine — a slow metallic sweep, not a static fill. */
function Sinzu({ className = '' }: { className?: string }) {
  return <span className={`gold-shimmer ${className}`}>$INZU</span>;
}

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Orders are processed within 1–2 business days. Delivery typically takes 3–7 business days depending on your location. You will receive tracking details by email as soon as your order ships.',
  },
  {
    q: 'What is your return policy?',
    a: 'Unopened products can be returned within 14 days of delivery for a full refund. For hygiene reasons, opened skincare and haircare products cannot be returned. Jewelry can be exchanged within 14 days if unworn.',
  },
  {
    q: 'Do you restock sold-out items?',
    a: 'Popular pieces are restocked regularly. Follow @sinzu.llc on Instagram or join our email list — restocks are announced there first.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'If your order has not shipped yet, yes — email us as soon as possible with your order number and we will take care of it.',
  },
];

export default function ContactPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeLocation, setActiveLocation] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', topic: 'Order question', message: '' });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = () => {
    const subject = encodeURIComponent(`[${form.topic}] Message from ${form.name || 'the website'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:info@sinzullc.com?subject=${subject}&body=${body}`;
  };

  const inputClass =
    'w-full bg-white gold-border-soft rounded-sm px-5 py-4 text-[0.95rem] text-[#1A1A1A] placeholder-[#B0A48F] outline-none focus:border-[#D9B54E] transition-colors font-light';

  const location = STORE_LOCATIONS[activeLocation];
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.mapQuery)}`;

  return (
    <main className="min-h-screen bg-white font-sans text-[#1A1A1A] antialiased selection:bg-[#D9B54E] selection:text-white">
      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(56px) scale(0.97);
          transition: opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .fade-up.visible { opacity: 1; transform: translateY(0) scale(1); }

        /* Gold now shows up only as: the wordmark shimmer, thin borders,
           and small eyebrow labels — never as a large flat fill. */
        .gold-border { border: 1.5px solid #D9B54E; }
        .gold-border-soft { border: 1px solid rgba(217, 181, 78, 0.3); }

        .gold-shimmer {
          background: linear-gradient(100deg, #C89B3C 15%, #E9C468 30%, #FFF6DC 45%, #FFFFFF 50%, #FFF6DC 55%, #E9C468 70%, #C89B3C 85%);
          background-size: 180% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: shimmerSweep 7s ease-in-out infinite;
          filter: drop-shadow(0 0 8px rgba(233, 196, 104, 0.2));
        }
        @keyframes shimmerSweep {
          0% { background-position: 0% center; }
          100% { background-position: 180% center; }
        }

        /* Dark surfaces replace the old flat cream (#F5F0E8) fills —
           this is where "black gold" actually reads as black + gold. */
        .dark-panel { background-color: #14110C; }
        .dark-weave {
          background-image:
            repeating-linear-gradient(45deg, rgba(217,181,78,0.14) 0px, rgba(217,181,78,0.14) 1px, transparent 1px, transparent 13px),
            repeating-linear-gradient(-45deg, rgba(217,181,78,0.14) 0px, rgba(217,181,78,0.14) 1px, transparent 1px, transparent 13px);
        }

        .btn-dark {
          position: relative;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-dark::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #1A1A1A;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          border-radius: 9999px;
        }
        .btn-dark:hover::before { transform: scaleX(1); transform-origin: left; }
        .btn-dark:hover { color: white; border-color: #1A1A1A; }

        .btn-light {
          position: relative;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-light::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #D9B54E;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          border-radius: 9999px;
        }
        .btn-light:hover::before { transform: scaleX(1); transform-origin: left; }
        .btn-light:hover { color: #1A1A1A; border-color: #D9B54E; }

        .contact-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: #D9B54E;
          transform: scaleX(0);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .contact-card:hover::before { transform: scaleX(1); }

        .faq-answer {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-answer.open { grid-template-rows: 1fr; }
        .faq-answer > div { overflow: hidden; }
        .faq-icon { transition: transform 0.35s ease; }
        .faq-icon.open { transform: rotate(45deg); }

        .loc-tab {
          transition: color 0.3s ease, border-color 0.3s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up { opacity: 1; transform: none; transition: none; }
          .gold-shimmer { animation: none; background-position: 40% center; }
          .faq-answer, .faq-icon, .btn-dark, .btn-dark::before, .btn-light, .btn-light::before { transition: none; }
        }
      `}</style>

      <AnnouncementBar />
      <Header />

      {/* SECTION 1 — HERO */}
      <section className="min-h-[70vh] flex items-center pt-20 md:pt-28 pb-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="fade-up">
            <div className="w-[60px] h-[2px] bg-[#D9B54E] mb-8" />
            <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">
              Contact
            </span>
            <h1 className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] mb-6 text-[#1A1A1A] tracking-tight">
              Talk to <Sinzu />.
            </h1>
            <p className="text-[#6B6B6B] text-base md:text-[1.05rem] leading-[1.9] max-w-md font-light">
              Questions about an order, a product, or a piece you have your eye on — we read everything, and we reply fast.
            </p>
          </div>
          <div className="h-[38vh] lg:h-[55vh] min-h-[300px] rounded-sm dark-panel dark-weave fade-up relative overflow-hidden" style={{ transitionDelay: '0.1s' }}>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
            {/* Replace with: <img src="/contact/hero.jpg" alt="SINZU studio" className="w-full h-full object-cover" /> */}
          </div>
        </div>
      </section>

      {/* SECTION 2 — WAYS TO REACH US */}
      <section className="py-20 md:py-32 px-6 md:px-12 lg:px-16 bg-white">
        <div className="text-center mb-14 md:mb-20 fade-up">
          <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">
            Reach Us
          </span>
          <h2 className="font-serif text-[clamp(1.6rem,3.5vw,2.8rem)] leading-[1.1]">Three Ways In</h2>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Clock,
              title: 'Business Hours',
              value: 'M–F, 7am–10pm EST',
              sub: 'We answer within one business day.',
              href: null as string | null,
            },
            {
              icon: Mail,
              title: 'Email',
              value: 'info@sinzullc.com',
              sub: 'Best for orders and detailed questions.',
              href: 'mailto:info@sinzullc.com',
            },
            {
              icon: Instagram,
              title: 'Instagram',
              value: '@sinzu.llc',
              sub: 'DMs, restock news, and your tags.',
              href: 'https://instagram.com/sinzu.llc',
            },
          ].map((item, i) => {
            const inner = (
              <>
                <div className="w-14 h-14 rounded-full gold-border flex items-center justify-center mx-auto mb-6 bg-white">
                  <item.icon className="w-5 h-5 text-[#D9B54E]" strokeWidth={1.2} />
                </div>
                <h3 className="font-serif text-[1.3rem] mb-2">{item.title}</h3>
                <p className="text-[0.95rem] text-[#1A1A1A] mb-2">{item.value}</p>
                <p className="text-[0.85rem] text-[#8B7355] font-light">{item.sub}</p>
              </>
            );
            const cardClass =
              'contact-card gold-border-soft relative block p-10 md:p-12 bg-white rounded-sm text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] fade-up';
            return item.href ? (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={cardClass}
                style={{ transitionDelay: `${(i + 1) * 0.12}s` }}
              >
                {inner}
              </a>
            ) : (
              <div key={item.title} className={cardClass} style={{ transitionDelay: `${(i + 1) * 0.12}s` }}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2.5 — FIND US IN STORE: real map + storefront photos */}
      <section className="py-24 md:py-36 px-6 md:px-12 lg:px-16 dark-panel dark-weave relative overflow-hidden">
        <div className="max-w-[1300px] mx-auto relative z-10">
          <div className="text-center mb-14 md:mb-16 fade-up">
            <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">
              Visit In Person
            </span>
            <h2 className="font-serif text-[clamp(1.6rem,3.5vw,2.8rem)] leading-[1.1] text-white">Find Us</h2>
          </div>

          {STORE_LOCATIONS.length > 1 && (
            <div className="flex items-center justify-center gap-8 mb-10 fade-up">
              {STORE_LOCATIONS.map((loc, i) => (
                <button
                  key={loc.name}
                  onClick={() => setActiveLocation(i)}
                  className={`loc-tab pb-2 text-[0.8rem] tracking-[0.1em] uppercase border-b-2 ${
                    activeLocation === i ? 'text-[#D9B54E] border-[#D9B54E]' : 'text-white/40 border-transparent hover:text-white/70'
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Real, embedded Google Map */}
            <div className="fade-up rounded-sm overflow-hidden gold-border-soft h-[320px] md:h-[420px]" style={{ transitionDelay: '0.1s' }}>
              <iframe
                title={`Map to ${location.name}`}
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.15) contrast(1.05)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Address + storefront photos */}
            <div className="fade-up flex flex-col gap-6" style={{ transitionDelay: '0.2s' }}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full gold-border flex items-center justify-center shrink-0 bg-transparent">
                  <MapPin className="w-4 h-4 text-[#D9B54E]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif text-[1.15rem] text-white mb-1">{location.name}</h3>
                  <p className="text-[0.9rem] text-white/60 font-light leading-relaxed">{location.address}</p>
                </div>
              </div>

              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-light inline-flex items-center gap-3 self-start px-8 py-3.5 border border-[#D9B54E] rounded-full text-[11px] tracking-[0.18em] uppercase text-[#D9B54E] cursor-pointer font-medium bg-transparent"
              >
                <Navigation className="w-4 h-4 relative z-10" strokeWidth={1.5} />
                <span className="relative z-10">Get Directions</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — MESSAGE FORM */}
      <section className="py-24 md:py-40 px-6 md:px-12 lg:px-16 bg-white">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div className="h-[320px] md:h-[560px] rounded-sm dark-panel dark-weave fade-up relative overflow-hidden lg:sticky lg:top-28">
            {/* Replace with: <img src="/contact/form.jpg" alt="SINZU products" className="w-full h-full object-cover" /> */}
          </div>

          <div className="fade-up">
            <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">
              Write to Us
            </span>
            <h2 className="font-serif text-[clamp(1.6rem,3.5vw,2.8rem)] leading-[1.1] mb-10">
              Send a Message
            </h2>

            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  className={inputClass}
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className={inputClass}
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <select
                className={`${inputClass} cursor-pointer`}
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              >
                <option>Order question</option>
                <option>Shipping & delivery</option>
                <option>Product advice</option>
                <option>Returns & exchanges</option>
                <option>Partnership</option>
                <option>Something else</option>
              </select>
              <textarea
                className={`${inputClass} min-h-[160px] resize-y`}
                placeholder="How can we help?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <div>
                <button
                  onClick={handleSubmit}
                  className="btn-dark inline-flex items-center gap-3 px-10 py-4 border border-[#1A1A1A] rounded-full text-[11px] tracking-[0.18em] uppercase text-[#1A1A1A] cursor-pointer font-medium bg-white"
                >
                  <span className="relative z-10">Send Message</span>
                  <ArrowRight className="w-4 h-4 relative z-10" strokeWidth={1.5} />
                </button>
                <p className="text-[0.78rem] text-[#8B7355] font-light mt-4">
                  Opens your email app with everything filled in — or write us directly at info@sinzullc.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FAQ */}
      <section className="py-24 md:py-40 px-6 md:px-12 lg:px-16 bg-[#FAFAFA]">
        <div className="text-center mb-14 md:mb-20 fade-up">
          <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">
            Before You Write
          </span>
          <h2 className="font-serif text-[clamp(1.6rem,3.5vw,2.8rem)] leading-[1.1]">Quick Answers</h2>
        </div>
        <div className="max-w-[820px] mx-auto fade-up">
          {FAQS.map((faq, i) => {
            const open = openFaq === i;
            return (
              <div key={faq.q} className="border-b border-[rgba(217,181,78,0.3)]">
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left cursor-pointer"
                >
                  <span className="font-serif text-[1.1rem] md:text-[1.25rem] text-[#1A1A1A]">{faq.q}</span>
                  <Plus
                    className={`faq-icon w-4 h-4 shrink-0 text-[#D9B54E] ${open ? 'open' : ''}`}
                    strokeWidth={1.5}
                  />
                </button>
                <div className={`faq-answer ${open ? 'open' : ''}`}>
                  <div>
                    <p className="text-[0.95rem] text-[#6B6B6B] leading-[1.75] font-light pb-6 max-w-[60ch]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5 — CLOSING CTA */}
      <section className="relative py-28 md:py-44 px-6 md:px-12 lg:px-16 dark-panel dark-weave text-center overflow-hidden">
        <div className="relative z-10 fade-up max-w-[600px] mx-auto">
          <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">
            While You Wait
          </span>
          <h2 className="font-serif text-[clamp(1.8rem,4vw,3rem)] leading-[1.15] mb-10 text-white">
            Experience <Sinzu /> for Yourself
          </h2>
          <button
            onClick={() => router.push('/shop')}
            className="btn-light inline-flex items-center gap-3 px-10 py-4 border border-[#D9B54E] rounded-full text-[11px] tracking-[0.18em] uppercase text-[#D9B54E] cursor-pointer font-medium bg-transparent"
          >
            <span className="relative z-10">Shop Now</span>
            <ArrowRight className="w-4 h-4 relative z-10" strokeWidth={1.5} />
          </button>
        </div>
      </section>

      <ChatWidget />
    </main>
  );
}