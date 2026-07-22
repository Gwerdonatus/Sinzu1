"use client";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500&display=swap');

        /* ── Layout tokens ── */
        :root {
          /* ⟵ SET THIS ONCE to your real header height so the hero
             fills exactly one screen beneath it (desktop only). */
          --site-header-h: 72px;

          --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
          --ease-out-quart: cubic-bezier(0.16, 1, 0.3, 1);
          --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ── Keyframes ── */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(28px) scale(0.98); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }

        @keyframes jewelDrop {
          0%   { opacity: 0; transform: translateY(-14px) scale(0.7); }
          60%  { opacity: 1; transform: translateY(2px) scale(1.06); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes riseIn {
          0%   { opacity: 0; transform: translateY(36px); filter: blur(8px); letter-spacing: 0.12em; }
          65%  { filter: blur(1px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); letter-spacing: 0.04em; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        @keyframes goldBloom {
          0%   { opacity: 0; transform: scale(0.97); filter: blur(6px); }
          65%  { opacity: 1; transform: scale(1.005); filter: blur(1px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }

        @keyframes lineReveal {
          from { opacity: 0; transform: scaleX(0); }
          to   { opacity: 1; transform: scaleX(1); }
        }

        /* ── Utility classes ── */
        .font-playfair { font-family: 'Playfair Display', 'Georgia', serif; }
        .font-inter    { font-family: 'Inter', 'Helvetica Neue', sans-serif; }

        .anim-fade {
          animation: fadeInUp 0.75s var(--ease-out-expo) forwards;
          opacity: 0;
          will-change: opacity, transform;
        }
        .anim-slide {
          animation: slideInRight 1.1s var(--ease-out-expo) forwards;
          opacity: 0;
          will-change: opacity, transform;
        }
        .anim-jewel {
          animation: jewelDrop 0.85s var(--ease-out-expo) forwards;
          opacity: 0;
          will-change: opacity, transform;
        }

        /* ── Headline crossfade ── */
        .headline-wrap {
          position: relative;
          display: inline-block;
          width: 100%;
          text-align: center;
          line-height: 0.92;
        }

        .headline-base {
          display: inline-block;
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          color: #2b1d10;
          opacity: 0;
          animation:
            riseIn 1.0s var(--ease-out-quart) 0.30s both,
            fadeOut 0.70s ease-in 2.0s forwards;
          will-change: opacity, transform, filter;
        }

        .headline-gold {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-style: italic;
          letter-spacing: 0.04em;
          opacity: 0;
          /* Deep antique gold — no near-white stops, so every
             letterform stays fully legible on the white canvas. */
          background-image: linear-gradient(
            135deg,
            #54400e 0%, #7a5c15 18%, #a8862a 36%, #d4b457 48%,
            #e2c471 50%, #d4b457 52%, #a8862a 64%, #7a5c15 82%, #54400e 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 1px 1px rgba(110, 78, 8, 0.25));
          animation: goldBloom 1.1s var(--ease-out-quart) 2.0s forwards;
          will-change: opacity, transform, filter;
        }

        .divider-line {
          opacity: 0;
          transform-origin: center;
          animation: lineReveal 0.70s var(--ease-out-expo) 2.60s forwards;
          will-change: opacity, transform;
        }

        @media (min-width: 768px) {
          .headline-wrap { text-align: left; }
          .headline-gold { justify-content: flex-start; }
          .divider-line  { transform-origin: left; }

          /* ── Desktop only: hero = exactly one screen under the header ── */
          .hero-viewport-fit {
            height: calc(100vh - var(--site-header-h));
            height: calc(100svh - var(--site-header-h));
            min-height: 600px;
          }
        }

        /* ── Respect user motion preferences ── */
        @media (prefers-reduced-motion: reduce) {
          .anim-fade, .anim-slide, .anim-jewel,
          .headline-base, .headline-gold, .divider-line {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      {/* Soft champagne glow behind the image side (desktop only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "radial-gradient(60% 85% at 78% 50%, rgba(243, 230, 197, 0.5) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />

      <div className="relative flex flex-col md:flex-row w-full min-h-[480px] sm:min-h-[520px] hero-viewport-fit">

        {/* Text Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center md:items-start md:text-left px-6 pt-10 pb-8 md:px-14 lg:px-20 md:py-10 order-1">

          <p
            className="font-inter text-[10px] md:text-[11px] font-medium text-[#8a6d2b] tracking-[0.35em] uppercase mb-5 md:mb-6 anim-fade"
            style={{ animationDelay: "0.0s" }}
          >
            Shine. Elevate.
          </p>

          <div
            className="mb-3 md:mb-4 anim-jewel"
            style={{ animationDelay: "0.15s" }}
          >
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="jewelSharp" x1="0" y1="0" x2="48" y2="48">
                  <stop offset="0%" stopColor="#7a5c15" />
                  <stop offset="30%" stopColor="#a8862a" />
                  <stop offset="50%" stopColor="#e2c471" />
                  <stop offset="70%" stopColor="#a8862a" />
                  <stop offset="100%" stopColor="#7a5c15" />
                </linearGradient>
              </defs>
              <path d="M16 10 L24 6 L32 10 L30 16 H18 Z" fill="url(#jewelSharp)" />
              <path d="M8 18 L16 10 L18 16 L14 24 Z" fill="url(#jewelSharp)" opacity="0.85" />
              <path d="M40 18 L32 10 L30 16 L34 24 Z" fill="url(#jewelSharp)" opacity="0.85" />
              <path d="M18 16 L24 14 L30 16 L24 24 Z" fill="#f6ecc9" opacity="0.9" />
              <path d="M14 24 L24 24 L24 42 L8 18 Z" fill="url(#jewelSharp)" opacity="0.75" />
              <path d="M34 24 L24 24 L24 42 L40 18 Z" fill="url(#jewelSharp)" opacity="0.9" />
              <path d="M24 14 V42" stroke="#f6ecc9" strokeWidth="0.8" opacity="0.5" />
              <circle cx="38" cy="8" r="1.5" fill="#e2c471" />
              <circle cx="39" cy="7" r="0.8" fill="#f6ecc9" />
            </svg>
          </div>

          {/* Headline: bronze rises, then crossfades to deep antique gold */}
          <div className="headline-wrap mb-5 md:mb-6">
            <span className="headline-base text-[3.5rem] sm:text-5xl md:text-[3.8rem] lg:text-[4.6rem] xl:text-[5.2rem] leading-[0.92]">
              BEAUTY
            </span>
            <span className="headline-gold text-[3.5rem] sm:text-5xl md:text-[3.8rem] lg:text-[4.6rem] xl:text-[5.2rem] leading-[0.92]">
              BEAUTY
            </span>
          </div>

          <div
            className="w-10 h-[2px] bg-gradient-to-r from-[#a8862a] via-[#e2c471] to-[#a8862a] mb-6 md:mb-8 divider-line mx-auto md:mx-0"
          />

          <p
            className="font-inter text-[14px] md:text-[15px] font-light text-[#5b5348] leading-[1.7] mb-8 max-w-sm anim-fade"
            style={{ animationDelay: "0.85s" }}
          >
            Timeless jewelry, luxurious hair care, and radiant skincare — crafted to make you shine in every moment.
          </p>

          <div className="anim-fade" style={{ animationDelay: "1.05s" }}>
            <button className="font-inter rounded-full bg-[#1a1a1a] text-white px-10 py-3.5 text-[10px] md:text-[11px] font-medium tracking-[0.25em] uppercase hover:bg-[#54400e] transition-colors duration-500">
              Shop Now
            </button>
          </div>

          {/* Category anchors — desktop only, so mobile stays identical */}
          <p
            className="hidden md:block font-inter text-[10px] font-medium text-[#96762e] tracking-[0.3em] uppercase mt-7 anim-fade"
            style={{ animationDelay: "1.25s" }}
          >
            Jewelry&nbsp;&nbsp;·&nbsp;&nbsp;Hair Care&nbsp;&nbsp;·&nbsp;&nbsp;Skincare
          </p>
        </div>

        {/* Image Side — fills the full hero height on desktop */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-0 md:px-8 md:py-10 lg:px-12 order-2">
          <div
            className="relative w-full md:h-full md:max-w-none anim-slide"
            style={{ animationDelay: "0.55s" }}
          >
            <div
              className="p-[3px] md:p-[4px] md:h-full"
              style={{
                background:
                  "linear-gradient(180deg, #54400e 0%, #a8862a 15%, #e2c471 35%, #f6ecc9 50%, #e2c471 65%, #a8862a 85%, #54400e 100%)",
                borderRadius: "60px 0 0 60px",
              }}
            >
              <div
                className="relative overflow-hidden w-full h-[360px] sm:h-[400px] md:h-full"
                style={{ borderRadius: "57px 0 0 57px" }}
              >
                <img
                  src="/sinzu-hero.png"
                  alt="SINZU Runway"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}