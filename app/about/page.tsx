'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ChatWidget from '@/components/ChatWidget';
import AnnouncementBar from '@/components/AnnouncementBar';
import { Star, Heart, Users, Sparkles, ArrowRight, BookOpen, Camera } from 'lucide-react';

/* =========================================================
   SINZU — About page (Redesigned v2)
   Editorial luxury aesthetic inspired by Exvia portfolio
   ========================================================= */

/** Paste generated or real photo URLs here — each one appears
 *  automatically everywhere it's used below. Leave blank to keep
 *  showing the placeholder caption for that spot.
 *
 *  These five are real, free (non-Unsplash+) stock photos, filled in
 *  as working placeholders so you can see the page with images in it.
 *  Swap any of them for your own photography whenever you're ready —
 *  same process, just replace the URL. Credit while these stay live:
 *  heroBackdrop — Good Faces (unsplash.com/@goodfacesagency)
 *  heroInset    — Jessica Felicio (unsplash.com/@jekafe)
 *  story        — SumUp (unsplash.com/@sumup)
 *  values       — Leighann Blackwood (unsplash.com/@ohleighann)
 *  why          — Ruan Richard Rodrigues (unsplash.com/@ricdeoliveira)
 */
const IMAGE_URLS = {
  heroBackdrop: 'https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?q=80&w=1600&auto=format&fit=crop',
  heroInset: 'https://images.unsplash.com/photo-1539701938214-0d9736e1c16b?q=80&w=1200&auto=format&fit=crop',
  story: 'https://images.unsplash.com/photo-1746723391801-1a24f7a57730?q=80&w=1600&auto=format&fit=crop',
  values: 'https://images.unsplash.com/photo-1693004927824-f2623bbedc8b?q=80&w=1600&auto=format&fit=crop',
  why: 'https://images.unsplash.com/photo-1650455221359-3aebf920bcc5?q=80&w=1600&auto=format&fit=crop',
};

/** The wordmark: S becomes a dollar sign, the one place gold shines. */
function Sinzu({ className = '' }: { className?: string }) {
  return <span className={`gold-shimmer ${className}`}>$INZU</span>;
}

/** A reserved image spot: shows a real photo once `src` is set, and
 *  falls back to a dark placeholder with a caption telling you
 *  exactly what to shoot/generate until then. */
function ImageSlot({
  hint,
  path,
  src,
  className = '',
  kenBurns = true,
}: {
  hint: string;
  path: string;
  src?: string;
  className?: string;
  kenBurns?: boolean;
}) {
  if (src) {
    return (
      <div className={`dark-panel relative overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={hint}
          className={`w-full h-full object-cover grayscale contrast-110 transition-transform duration-[1400ms] ease-out ${
            kenBurns ? 'scale-[1.08] group-[.visible]:scale-100' : ''
          }`}
        />
      </div>
    );
  }
  return (
    <div className={`dark-panel dark-weave relative overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-center px-8 gap-3 transition-transform duration-[1400ms] ease-out ${
          kenBurns ? 'scale-[1.08] group-[.visible]:scale-100' : ''
        }`}
      >
        <Camera className="w-5 h-5 text-[#D9B54E]/50" strokeWidth={1.3} />
        <p className="text-[0.8rem] text-white/45 font-light leading-relaxed max-w-[280px]">{hint}</p>
        <p className="text-[0.65rem] tracking-[0.15em] uppercase text-[#D9B54E]/40">{path}</p>
      </div>
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
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

    // Trigger hero immediately
    setTimeout(() => {
      document.querySelector('.hero .fade-up')?.classList.add('visible');
    }, 300);

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

  return (
    <main className="min-h-screen bg-[#FAF8F5] font-sans text-[#1A1A1A] antialiased selection:bg-[#D9B54E] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        .fade-up {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1), transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .fade-up.visible { opacity: 1; transform: translateY(0); }

        .word-reveal { display: inline-block; overflow: hidden; vertical-align: top; }
        .word-reveal span {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1), opacity 1s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .fade-up.visible .word-reveal span { transform: translateY(0); opacity: 1; }

        .dark-panel { background-color: #14110C; }
        .dark-weave {
          background-image:
            repeating-linear-gradient(45deg, rgba(217,181,78,0.14) 0px, rgba(217,181,78,0.14) 1px, transparent 1px, transparent 13px),
            repeating-linear-gradient(-45deg, rgba(217,181,78,0.14) 0px, rgba(217,181,78,0.14) 1px, transparent 1px, transparent 13px);
        }

        .gold-shimmer {
          background: linear-gradient(100deg, #C89B3C 15%, #E9C468 30%, #FFF6DC 45%, #FFFFFF 50%, #FFF6DC 55%, #E9C468 70%, #C89B3C 85%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: shimmerSweep 8s ease-in-out infinite;
        }
        @keyframes shimmerSweep {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
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
        .btn-gold:hover { color: #14110C; border-color: #D9B54E; }

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
          font-family: 'Cormorant Garamond', Georgia, serif;
          line-height: 0.6;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up { opacity: 1 !important; transform: none !important; transition: none !important; }
          .word-reveal span { opacity: 1 !important; transform: none !important; }
          .gold-shimmer { animation: none; }
        }
      `}</style>

      <AnnouncementBar />
      <Header />

      {/* =========================================================
          SECTION 1 — HERO
          Exvia-style: full-bleed backdrop photo, a sharper inset
          portrait layered on top, floating corner tags, and the
          brand's own name as the giant nameplate — since we're a
          brand, $INZU stands where a person's name would.
          ========================================================= */}
      <section className="hero relative min-h-screen bg-[#14110C] flex items-end overflow-hidden">
        {/* Full-bleed backdrop photo */}
        <div className="absolute inset-0">
          <ImageSlot
            hint="Full-bleed portrait of the founder or a signature product — desaturated toward grayscale, softly out of focus. This is the backdrop the wordmark sits on."
            path="/about/hero-backdrop.jpg"
            src={IMAGE_URLS.heroBackdrop}
            className="w-full h-full"
            kenBurns={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14110C] via-[#14110C]/35 to-[#14110C]/70" />
        </div>

        {/* Inset sharp portrait — the layered "photo within a photo" moment */}
        <div
          className="absolute left-1/2 top-[12%] -translate-x-1/2 w-[200px] h-[270px] sm:w-[260px] sm:h-[350px] md:w-[300px] md:h-[400px] z-[5] fade-up"
          style={{ transitionDelay: '0.15s' }}
        >
          <ImageSlot
            hint="Sharp, in-focus close crop — founder portrait, or a hero product macro shot."
            path="/about/hero-inset.jpg"
            src={IMAGE_URLS.heroInset}
            className="w-full h-full shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            kenBurns={false}
          />
        </div>

        {/* Floating corner labels — Exvia style, recolored to our gold */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block z-[6]">
          <span className="absolute top-[10%] left-[5%] text-[0.6rem] font-medium tracking-[0.2em] uppercase text-[#D9B54E]/70">
            Beauty &middot; Jewelry &middot; Skincare
          </span>
          <span className="absolute top-[10%] right-[5%] text-[0.6rem] font-medium tracking-[0.2em] uppercase text-[#D9B54E]/70">
            Blaine, Minnesota
          </span>
          <span className="absolute bottom-[26%] left-[5%] text-[0.6rem] font-medium tracking-[0.2em] uppercase text-white/45">
            Since 2021
          </span>
          <span className="absolute bottom-[26%] right-[5%] text-[0.6rem] font-medium tracking-[0.2em] uppercase text-white/45">
            Mall of America
          </span>
        </div>

        {/* Giant nameplate, anchored to the bottom */}
        <div className="relative z-10 w-full px-[5vw] pb-[7vh] fade-up">
          <p className="text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-white/50 mb-5">
            Luxury Rooted in Culture
          </p>
          <h1
            className="font-['Space_Grotesk'] font-bold gold-shimmer text-[clamp(4.5rem,16vw,12.5rem)] leading-[0.85] tracking-[-0.04em]"
          >
            $INZU
          </h1>
        </div>
      </section>

      {/* =========================================================
          SECTION 2 — ABOUT (Asymmetric editorial, Exvia-style)
          ========================================================= */}
      <section className="relative z-10 py-[12vh] px-[5vw] bg-[#FAF8F5]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-16 fade-up">
          <div className="pt-2">
            <span className="text-[0.65rem] font-medium tracking-[0.22em] uppercase text-[#8a7a6a]">
              About
            </span>
          </div>
          <div className="max-w-[560px]">
            <p className="text-[1.05rem] leading-[1.85] font-normal text-[#1A1A1A] mb-6">
              SINZU is more than a beauty brand. It is a celebration of intentional living, quality craftsmanship, and products that honor culture while embracing modern luxury.
            </p>
            <p className="text-[1.05rem] leading-[1.85] font-normal text-[#1A1A1A] mb-6">
              Inspired by African heritage and elevated through contemporary design, every collection — jewelry, haircare, and skincare — reflects quality, simplicity, and quiet confidence.
            </p>

            {/* Stats row — bold grotesk numerals, like Exvia's 10+ / 40+ / 95% */}
            <div className="mt-20 flex flex-col sm:flex-row gap-8 sm:gap-16 pt-12 border-t border-black/5">
              <div className="flex flex-col gap-2">
                <span className="font-['Space_Grotesk'] text-[2.8rem] font-bold leading-none text-[#1A1A1A]">
                  5<span className="text-[#D9B54E] text-[1.6rem] align-top">+</span>
                </span>
                <span className="text-[0.6rem] font-medium tracking-[0.2em] uppercase text-[#8a7a6a]">Years of Beauty</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-['Space_Grotesk'] text-[2.8rem] font-bold leading-none text-[#1A1A1A]">
                  3<span className="text-[#D9B54E] text-[1.6rem] align-top">+</span>
                </span>
                <span className="text-[0.6rem] font-medium tracking-[0.2em] uppercase text-[#8a7a6a]">Product Lines</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-['Space_Grotesk'] text-[2.8rem] font-bold leading-none text-[#1A1A1A]">2</span>
                <span className="text-[0.6rem] font-medium tracking-[0.2em] uppercase text-[#8a7a6a]">Retail Locations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3 — OUR STORY (Split editorial)
          ========================================================= */}
      <section className="relative z-10 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          <ImageSlot
            hint="Behind-the-scenes: making a SINZU piece, or the original Northtown Mall kiosk."
            path="/about/story.jpg"
            src={IMAGE_URLS.story}
            className="min-h-[40vh] lg:min-h-0"
          />
          <div className="py-[10vh] px-[5vw] lg:pl-[6vw] flex flex-col justify-center fade-up">
            <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">
              Our Story
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(2rem,3.5vw,3.2rem)] font-normal leading-[1.15] mb-10 text-[#1A1A1A]">
              Beauty,<br />Reimagined
            </h2>
            <p className="text-[1rem] leading-[1.85] font-normal text-[#5C4A32] mb-5">
              SINZU was created with one vision: to make everyday beauty feel intentional.
            </p>
            <p className="text-[1rem] leading-[1.85] font-normal text-[#5C4A32] mb-5">
              Inspired by African heritage and elevated through modern design, every collection — jewelry, haircare, and skincare — reflects quality, simplicity, and confidence.
            </p>
            <p className="text-[1rem] leading-[1.85] font-normal text-[#5C4A32] mb-5">
              Five years ago, we opened our first kiosk at Northtown Mall in Blaine, Minnesota. What started as a single storefront has grown into a community of everyday people who trust us with their self-care rituals.
            </p>
            <p className="text-[1rem] leading-[1.85] font-normal text-[#5C4A32]">
              This August, we&apos;re expanding to Mall of America — a milestone that felt impossible when we started, and one we&apos;re proud to share with the community that made it possible.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4 — 5 YEAR MILESTONE
          ========================================================= */}
      <section className="relative z-10 py-[6vh] px-[5vw] bg-[#14110C] text-center overflow-hidden">
        <div className="dark-weave absolute inset-0" />
        <div className="relative z-10 fade-up inline-flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <span className="font-['Cormorant_Garamond'] text-[clamp(4rem,10vw,7rem)] font-light leading-none gold-shimmer">5</span>
          <div className="text-center md:text-left">
            <p className="font-['Cormorant_Garamond'] text-[clamp(1.2rem,2vw,1.6rem)] text-white leading-tight font-normal">
              Years of Intentional Beauty
            </p>
            <p className="text-[0.8rem] text-white/40 font-light mt-2 tracking-wide">
              From one kiosk in Blaine to Mall of America — five years in the making.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5 — FOUNDER QUOTE
          ========================================================= */}
      <section className="relative z-10 py-[14vh] px-[5vw] bg-white">
        <div className="max-w-[720px] mx-auto text-center fade-up">
          <span className="quote-mark block text-[6rem] text-[#D9B54E] opacity-50 mb-4">&ldquo;</span>
          <p className="font-['Cormorant_Garamond'] text-[clamp(1.4rem,2.5vw,2rem)] font-normal italic leading-[1.55] text-[#1A1A1A] mb-10">
            We didn&apos;t want to build another beauty brand. We wanted to build a ritual — one that carries where we come from into how people feel every day.
          </p>
          <span className="block text-[0.7rem] font-medium tracking-[0.2em] uppercase text-[#8a7a6a]">Founder, <Sinzu /></span>
        </div>
      </section>

      {/* =========================================================
          SECTION 6 — OUR PHILOSOPHY
          ========================================================= */}
      <section className="relative z-10 py-[14vh] px-[5vw] bg-[#F5F2ED]">
        <div className="text-center mb-20 fade-up">
          <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">
            Our Philosophy
          </span>
          <h2 className="font-['Cormorant_Garamond'] text-[clamp(2rem,3.5vw,3rem)] font-normal leading-[1.15] text-[#1A1A1A]">
            What We Stand For
          </h2>
        </div>
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {philosophyCards.map((card, i) => (
            <div
              key={card.title}
              className="philosophy-card relative p-10 md:p-12 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.06)] fade-up"
              style={{ transitionDelay: `${(i + 1) * 0.1}s` }}
            >
              <div className="absolute top-4 left-4 w-6 h-6 border-t-[1.5px] border-l-[1.5px] border-[#D9B54E] opacity-25 rounded-tl-sm" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-[1.5px] border-r-[1.5px] border-[#D9B54E] opacity-25 rounded-br-sm" />
              <h3 className="font-['Cormorant_Garamond'] text-[1.4rem] md:text-[1.5rem] font-medium mb-4 text-[#1A1A1A]">{card.title}</h3>
              <p className="text-[0.9rem] text-[#5C4A32] leading-[1.75] font-normal">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 7 — OUR VALUES
          ========================================================= */}
      <section className="relative z-10 py-[14vh] px-[5vw] bg-white">
        <div className="max-w-[1300px] mx-auto">
          <ImageSlot
            hint="Lifestyle shot: someone using a SINZU product in their daily routine."
            path="/about/values.jpg"
            src={IMAGE_URLS.values}
            className="w-full h-[300px] md:h-[45vh] mb-24"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {values.map((item, i) => (
              <div key={item.title} className="text-center fade-up" style={{ transitionDelay: `${(i + 1) * 0.1}s` }}>
                <div className="w-14 h-14 rounded-full border border-[rgba(217,181,78,0.35)] flex items-center justify-center mx-auto mb-6 transition-all duration-400 hover:shadow-[0_0_24px_rgba(217,181,78,0.15)] hover:scale-105 bg-white">
                  <item.icon className="w-5 h-5 text-[#D9B54E]" strokeWidth={1.2} />
                </div>
                <h4 className="font-['Cormorant_Garamond'] font-medium text-[1.2rem] mb-3 text-[#1A1A1A]">{item.title}</h4>
                <p className="text-[0.85rem] text-[#8a7a6a] font-normal leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 8 — WHY SINZU (Reverse split)
          ========================================================= */}
      <section className="relative z-10 bg-[#FAF8F5]">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          <div className="py-[10vh] px-[5vw] lg:pr-[6vw] flex flex-col justify-center fade-up order-2 lg:order-1">
            <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">Our Purpose</span>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(2rem,3.5vw,3.2rem)] font-normal leading-[1.15] mb-10 text-[#1A1A1A]">Why We Exist</h2>
            <p className="text-[1rem] leading-[1.85] font-normal text-[#5C4A32] mb-5 max-w-[480px]">
              <Sinzu /> exists to redefine everyday luxury through products that are intentional, culturally inspired, and beautifully crafted.
            </p>
            <p className="text-[1rem] leading-[1.85] font-normal text-[#5C4A32] max-w-[480px]">
              Whether skincare, haircare, or jewelry, every collection is created to make people feel confident in their own story.
            </p>
          </div>
          <ImageSlot
            hint="Close-up detail shot: texture, packaging, or a jewelry finish."
            path="/about/why.jpg"
            src={IMAGE_URLS.why}
            className="min-h-[40vh] lg:min-h-0 order-1 lg:order-2"
          />
        </div>
      </section>

      {/* =========================================================
          SECTION 9 — OUR STANDARD
          ========================================================= */}
      <section className="relative z-10 py-[14vh] px-[5vw] bg-[#14110C] text-center overflow-hidden">
        <div className="dark-weave absolute inset-0" />
        <div className="relative z-10 fade-up">
          <p className="font-['Cormorant_Garamond'] text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.25] text-white">Premium products.</p>
          <p className="font-['Cormorant_Garamond'] text-[clamp(2rem,4.5vw,3.5rem)] font-normal italic leading-[1.25] gold-shimmer">Intentional beauty.</p>
          <p className="font-['Cormorant_Garamond'] text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.25] text-white">Timeless quality.</p>
          <div className="w-10 h-[1.5px] bg-[#D9B54E] mx-auto mt-10 opacity-60" />
        </div>
      </section>

      {/* =========================================================
          SECTION 10 — CLOSING CTA
          ========================================================= */}
      <section className="relative z-10 py-[12vh] px-[5vw] bg-[#14110C] text-center overflow-hidden">
        <div className="dark-weave absolute inset-0" />
        <div className="relative z-10 fade-up max-w-[600px] mx-auto">
          <span className="block text-[0.7rem] font-medium tracking-[0.25em] uppercase text-[#D9B54E] mb-6">The Collection</span>
          <h2 className="font-['Cormorant_Garamond'] text-[clamp(1.8rem,4vw,2.8rem)] font-normal leading-[1.15] mb-12 text-white">
            Experience <Sinzu /> for Yourself
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/shop')}
              className="btn-gold inline-flex items-center gap-3 px-10 py-4 border border-[#D9B54E] rounded-full text-[0.65rem] tracking-[0.18em] uppercase text-[#D9B54E] cursor-pointer font-medium bg-transparent"
            >
              <span className="relative z-10">Shop Now</span>
              <ArrowRight className="w-4 h-4 relative z-10" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => router.push('/journal')}
              className="inline-flex items-center gap-2 px-10 py-4 text-[0.65rem] tracking-[0.18em] uppercase text-white/50 hover:text-white transition-colors cursor-pointer font-medium"
            >
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