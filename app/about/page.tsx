'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ChatWidget from '@/components/ChatWidget';
import AnnouncementBar from '@/components/AnnouncementBar';
import { Star, Heart, Users, Sparkles, ArrowRight, BookOpen, Camera } from 'lucide-react';

/* =========================================================
   SINZU — About page

   ⚠️ IMAGE PLACEHOLDERS: each dark block below has a visible
   caption describing exactly what to shoot for that spot —
   read it on the live page, then once you have the photo,
   find the matching "Replace with:" comment in the code and
   drop in an <img> tag pointing at your file.
   ========================================================= */

/** The wordmark: S becomes a dollar sign, the one place gold shines. */
function Sinzu({ className = '' }: { className?: string }) {
  return <span className={`gold-shimmer ${className}`}>$INZU</span>;
}

/** A reserved image spot: dark, textured, with a caption telling you
 *  exactly what to shoot. Swap the whole thing for a real <img> later. */
function ImageSlot({
  hint,
  path,
  className = '',
  kenBurns = true,
}: {
  hint: string;
  path: string;
  className?: string;
  kenBurns?: boolean;
}) {
  return (
    <div className={`dark-panel dark-weave relative overflow-hidden rounded-sm fade-up ${className}`}>
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-center px-8 gap-3 transition-transform duration-[1400ms] ease-out ${
          kenBurns ? 'scale-[1.08] group-[.visible]:scale-100' : ''
        }`}
      >
        <Camera className="w-5 h-5 text-[#D9B54E]/50" strokeWidth={1.3} />
        <p className="text-[0.8rem] text-white/45 font-light leading-relaxed max-w-[280px]">{hint}</p>
        <p className="text-[0.65rem] tracking-[0.15em] uppercase text-[#D9B54E]/40">{path}</p>
      </div>
      {/* Replace with: <img src="PATH" alt="..." className="w-full h-full object-cover" /> */}
    </div>
  );
}

export default function AboutPage() {
  const router = useRouter();

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

  const philosophyCards = [
    {
      title: 'Intentional Craftsmanship',
      body: 'Every product is selected with care and designed to deliver both quality and purpose. We believe that true luxury lies in the details.',
    },
    {
      title: 'Cultural Heritage',
      body: 'Our roots inspire everything we create while embracing a modern global perspective. Culture is not a trend — it is our foundation.',
    },
    {
      title: 'Luxury Accessibility',
      body: 'Premium products designed to elevate everyday routines without unnecessary excess. Luxury that feels within reach.',
    },
  ];

  const values = [
    { icon: Star, title: 'Quality', desc: 'We never compromise on excellence.' },
    { icon: Heart, title: 'Authenticity', desc: 'Our identity is rooted in culture and honesty.' },
    { icon: Users, title: 'Community', desc: 'We create products that connect people through shared experiences.' },
    { icon: Sparkles, title: 'Elegance', desc: 'Luxury lives in simplicity and thoughtful design.' },
  ];

  const heroWords = ['Luxury', 'Rooted', 'in'];

  return (
    <main className="min-h-screen bg-white font-sans text-[#1A1A1A] antialiased selection:bg-[#D9B54E] selection:text-white">
      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(50px) scale(0.98);
          transition: opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .fade-up.visible { opacity: 1; transform: translateY(0) scale(1); }
        .delay-1 { transition-delay: 0.12s; }
        .delay-2 { transition-delay: 0.24s; }
        .delay-3 { transition-delay: 0.36s; }
        .delay-4 { transition-delay: 0.48s; }

        .dark-panel { background-color: #14110C; }
        .dark-weave {
          background-image:
            repeating-linear-gradient(45deg, rgba(217,181,78,0.14) 0px, rgba(217,181,78,0.14) 1px, transparent 1px, transparent 13px),
            repeating-linear-gradient(-45deg, rgba(217,181,78,0.14) 0px, rgba(217,181,78,0.14) 1px, transparent 1px, transparent 13px);
        }

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

        .btn-gold {
          position: relative;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-gold::before {
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
        .btn-gold:hover::before { transform: scaleX(1); transform-origin: left; }
        .btn-gold:hover { color: white; border-color: #D9B54E; }

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

        .gold-line {
          width: 0;
          height: 2px;
          background: #D9B54E;
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gold-line.visible { width: 60px; }

        .philosophy-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: #D9B54E;
          transform: scaleX(0);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .philosophy-card:hover::before { transform: scaleX(1); }

        .quote-mark {
          font-family: Georgia, serif;
          line-height: 0.6;
        }

        /* Word-by-word headline reveal */
        .word-wrap { display: inline-block; overflow: hidden; vertical-align: top; }
        .word-inner {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .fade-up.visible .word-inner { transform: translateY(0); opacity: 1; }

        @media (prefers-reduced-motion: reduce) {
          .fade-up { opacity: 1 !important; transform: none !important; transition: none !important; }
          .word-inner { opacity: 1 !important; transform: none !important; }
          .gold-shimmer { animation: none; }
        }
      `}</style>

      <AnnouncementBar />
      <Header />

      {/* SECTION 1 — HERO */}
      <section className="min-h-[85vh] flex items-center pt-20 md:pt-28 pb-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ImageSlot
            hint="Founder or product hero shot, soft editorial lighting. Vertical orientation."
            path="/about/hero.jpg"
            className="h-[45vh] lg:h-[65vh] min-h-[350px] order-2 lg:order-1"
          />
          <div className="order-1 lg:order-2 lg:pl-8 fade-up">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#D9B54E]/40 bg-[#D9B54E]/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9B54E]" />
              <span className="text-[0.7rem] tracking-[0.15em] uppercase font-semibold text-[#5C4A32]">5 Years of <Sinzu /></span>
            </div>
            <div className="gold-line mb-8" />
            <h1 className="font-serif font-bold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] mb-6 text-[#1A1A1A] tracking-tight">
              {heroWords.map((w, i) => (
                <span key={w} className="word-wrap mr-[0.28em]">
                  <span className="word-inner" style={{ transitionDelay: `${0.1 + i * 0.09}s` }}>{w}</span>
                </span>
              ))}
              <span className="word-wrap">
                <span className="word-inner gold-shimmer not-italic" style={{ transitionDelay: `${0.1 + heroWords.length * 0.09}s` }}>
                  Culture.
                </span>
              </span>
            </h1>
            <p className="text-[#2E2A24] text-base md:text-[1.05rem] leading-[1.9] max-w-md mb-10 font-medium">
              SINZU is more than a beauty brand. It is a celebration of intentional living, quality craftsmanship, and products that honor culture while embracing modern luxury.
            </p>
            <button
              onClick={() => router.push('/shop')}
              className="btn-gold inline-flex items-center gap-3 px-8 py-3.5 border border-[#D9B54E] rounded-full text-[11px] tracking-[0.18em] uppercase text-[#D9B54E] cursor-pointer font-medium"
            >
              <span className="relative z-10">Explore Our Collection</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2 — OUR STORY */}
      <section className="py-24 md:py-40 px-6 md:px-12 lg:px-16 bg-white">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <ImageSlot
            hint="Behind-the-scenes: making a SINZU piece, or the original Northtown Mall kiosk."
            path="/about/story.jpg"
            className="h-[400px] md:h-[650px]"
          />
          <div className="lg:pr-8 fade-up delay-1">
            <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">
              Our Story
            </span>
            <h2 className="font-serif font-bold text-[clamp(1.6rem,3.5vw,2.8rem)] leading-[1.1] mb-6">
              Beauty, Reimagined
            </h2>
            <p className="text-[#2E2A24] text-[1.05rem] leading-[1.75] mb-5 font-medium">
              SINZU was created with one vision: to make everyday beauty feel intentional.
            </p>
            <p className="text-[#2E2A24] text-[1.05rem] leading-[1.75] mb-5 font-medium">
              Inspired by African heritage and elevated through modern design, every collection — jewelry, haircare, and skincare — reflects quality, simplicity, and confidence.
            </p>
            <p className="text-[#2E2A24] text-[1.05rem] leading-[1.75] mb-5 font-medium">
              Five years ago, we opened our first kiosk at Northtown Mall in Blaine, Minnesota. What started as a single storefront has grown into a community of everyday people who trust us with their self-care rituals.
            </p>
            <p className="text-[#2E2A24] text-[1.05rem] leading-[1.75] font-medium">
              This August, we&apos;re expanding to Mall of America — a milestone that felt impossible when we started, and one we&apos;re proud to share with the community that made it possible.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2.5 — 5 YEAR MILESTONE */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-16 bg-[#14110C] dark-weave text-center">
        <div className="fade-up flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <span className="font-serif text-[clamp(3.5rem,9vw,6rem)] leading-none gold-shimmer font-bold">5</span>
          <div className="text-left">
            <p className="font-serif text-[1.3rem] md:text-[1.6rem] text-white leading-tight font-bold">
              Years of Intentional Beauty
            </p>
            <p className="text-[0.85rem] text-white/50 font-medium tracking-wide mt-1">
              From one kiosk in Blaine to Mall of America — five years in the making.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FOUNDER QUOTE */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-white">
        <div className="max-w-[820px] mx-auto text-center fade-up">
          <span className="quote-mark block text-[5rem] text-[#D9B54E] mb-2">&ldquo;</span>
          <p className="font-serif text-[clamp(1.3rem,2.8vw,2rem)] leading-[1.5] text-[#1A1A1A] mb-8">
            We didn&rsquo;t want to build another beauty brand. We wanted to build a ritual — one that carries where we come from into how people feel every day.
          </p>
          <span className="block text-[0.75rem] tracking-[0.2em] uppercase text-[#5C4A32]">Founder, <Sinzu /></span>
        </div>
      </section>

      {/* SECTION 4 — OUR PHILOSOPHY */}
      <section className="py-24 md:py-40 px-6 md:px-12 lg:px-16 bg-[#FAFAFA]">
        <div className="text-center mb-16 md:mb-20 fade-up">
          <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">
            Our Philosophy
          </span>
          <h2 className="font-serif font-bold text-[clamp(1.6rem,3.5vw,2.8rem)] leading-[1.1]">
            What We Stand For
          </h2>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {philosophyCards.map((card, i) => (
            <div
              key={card.title}
              className="philosophy-card gold-border-soft relative p-10 md:p-12 bg-white rounded-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] fade-up"
              style={{ transitionDelay: `${(i + 1) * 0.12}s` }}
            >
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#D9B54E] rounded-tl-sm opacity-50" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#D9B54E] rounded-br-sm opacity-50" />
              <h3 className="font-serif text-[1.3rem] md:text-[1.5rem] font-bold mb-4">{card.title}</h3>
              <p className="text-[0.95rem] text-[#2E2A24] leading-[1.7] font-medium">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — OUR VALUES */}
      <section className="py-24 md:py-40 px-6 md:px-12 lg:px-16 bg-white">
        <div className="max-w-[1300px] mx-auto">
          <ImageSlot
            hint="Lifestyle shot: someone using a SINZU product in their daily routine."
            path="/about/values.jpg"
            className="w-full h-[300px] md:h-[500px] mb-16 md:mb-20"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {values.map((item, i) => (
              <div key={item.title} className="text-center px-4 fade-up" style={{ transitionDelay: `${(i + 1) * 0.12}s` }}>
                <div className="w-14 h-14 rounded-full gold-border flex items-center justify-center mx-auto mb-6 transition-all duration-400 hover:shadow-[0_0_20px_rgba(217,181,78,0.2)] hover:scale-105 bg-white">
                  <item.icon className="w-5 h-5 text-[#D9B54E]" strokeWidth={1.2} />
                </div>
                <h4 className="font-serif font-bold text-[1.3rem] mb-3">{item.title}</h4>
                <p className="text-[0.9rem] text-[#2E2A24] font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — WHY SINZU */}
      <section className="py-24 md:py-40 px-6 md:px-12 lg:px-16 bg-white">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="fade-up">
            <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">Our Purpose</span>
            <h2 className="font-serif font-bold text-[clamp(1.6rem,3.5vw,2.8rem)] leading-[1.1] mb-6">Why We Exist</h2>
            <p className="text-[#2E2A24] text-[1.05rem] leading-[1.75] mb-5 font-medium max-w-md">
              <Sinzu /> exists to redefine everyday luxury through products that are intentional, culturally inspired, and beautifully crafted.
            </p>
            <p className="text-[#2E2A24] text-[1.05rem] leading-[1.75] font-medium max-w-md">
              Whether skincare, haircare, or jewelry, every collection is created to make people feel confident in their own story.
            </p>
          </div>
          <ImageSlot
            hint="Close-up detail shot: texture, packaging, or a jewelry finish."
            path="/about/why.jpg"
            className="h-[400px] md:h-[600px] delay-1"
          />
        </div>
      </section>

      {/* SECTION 7 — OUR STANDARD */}
      <section className="relative py-32 md:py-48 px-6 md:px-12 lg:px-16 bg-[#14110C] text-center overflow-hidden dark-weave">
        <div className="relative z-10 fade-up">
          <h2 className="font-serif font-bold text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.2] text-white mb-2">Premium products.</h2>
          <h2 className="font-serif font-bold text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.2] gold-shimmer italic mb-2">Intentional beauty.</h2>
          <h2 className="font-serif font-bold text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.2] text-white">Timeless quality.</h2>
          <div className="w-10 h-[2px] bg-[#D9B54E] mx-auto mt-10" />
        </div>
      </section>

      {/* SECTION 8 — CLOSING CTA (now the page's landing point since the footer was removed) */}
      <section className="relative py-28 md:py-44 px-6 md:px-12 lg:px-16 bg-[#14110C] dark-weave text-center overflow-hidden">
        <div className="relative z-10 fade-up max-w-[600px] mx-auto">
          <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">The Collection</span>
          <h2 className="font-serif font-bold text-[clamp(1.8rem,4vw,3rem)] leading-[1.15] mb-10 text-white">
            Experience <Sinzu /> for Yourself
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => router.push('/shop')} className="btn-gold inline-flex items-center gap-3 px-10 py-4 border border-[#D9B54E] rounded-full text-[11px] tracking-[0.18em] uppercase text-[#D9B54E] cursor-pointer font-medium bg-transparent">
              <span className="relative z-10">Shop Now</span>
              <ArrowRight className="w-4 h-4 relative z-10" strokeWidth={1.5} />
            </button>
            <button onClick={() => router.push('/journal')} className="inline-flex items-center gap-2 px-10 py-4 text-[11px] tracking-[0.18em] uppercase text-white/60 hover:text-white transition-colors cursor-pointer font-medium">
              <BookOpen className="w-3.5 h-3.5" strokeWidth={1.5} />
              Read the Journal
            </button>
          </div>
        </div>
      </section>

      <ChatWidget />
    </main>
  );
}