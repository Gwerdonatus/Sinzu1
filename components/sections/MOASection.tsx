'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';

/* =========================================================
   MOA Milestone Section — Mall of America expansion.
   Full-viewport black canvas, gold headline gradient,
   minimal countdown, icon-circle pill buttons.
   ========================================================= */

const OPEN_DATE = new Date('2026-08-10T10:00:00-05:00');

function useCountdown(target: Date) {
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s, isOpen: diff === 0 };
}

export default function MOASection() {
  const { d, h, m, s, isOpen } = useCountdown(OPEN_DATE);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <section className="moa-section" aria-label="Mall of America expansion">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
        }

        .moa-section {
          position: relative;
          background: #000;
          color: #fff;
          overflow: hidden;
          font-family: 'Inter', 'Helvetica Neue', sans-serif;
        }

        /* Gold hairline at top */
        .moa-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(201, 162, 39, 0.5) 25%, rgba(245, 231, 163, 0.7) 50%, rgba(201, 162, 39, 0.5) 75%, transparent 100%);
          z-index: 2;
        }

        .moa-grid {
          display: grid;
          grid-template-columns: 1fr;
          max-width: 1280px;
          margin: 0 auto;
        }

        @media (min-width: 900px) {
          .moa-grid {
            grid-template-columns: 1fr 1fr;
            align-items: center;
            min-height: 100vh;
            min-height: 100dvh;
          }
        }

        /* Content column */
        .moa-content {
          padding: clamp(72px, 10vw, 120px) clamp(24px, 5vw, 72px);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        @media (min-width: 900px) {
          .moa-content {
            text-align: left;
            align-items: flex-start;
            padding-left: clamp(40px, 6vw, 80px);
          }
        }

        .moa-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .moa-eyebrow-line {
          width: 20px;
          height: 1px;
          background: rgba(201, 162, 39, 0.5);
        }

        .moa-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 600;
          font-style: italic;
          font-size: clamp(2.6rem, 5.5vw, 4.2rem);
          line-height: 1.05;
          background: linear-gradient(
            135deg,
            #c9a227 0%,
            #f5e7a3 25%,
            #ffffff 45%,
            #f5e7a3 65%,
            #c9a227 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          margin: 0 0 1.6rem;
          max-width: 12ch;
          animation: goldShine 8s ease-in-out infinite alternate;
        }

        @keyframes goldShine {
          0% { background-position: 0% 0; }
          100% { background-position: 100% 0; }
        }

        @media (max-width: 899px) {
          .moa-title {
            margin-left: auto;
            margin-right: auto;
          }
        }

        .moa-lede {
          font-size: 14px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.5);
          max-width: 42ch;
          margin: 0 0 3rem;
          font-weight: 300;
          letter-spacing: 0.01em;
        }

        @media (max-width: 899px) {
          .moa-lede {
            margin-left: auto;
            margin-right: auto;
          }
        }

        /* Countdown — editorial, minimal */
        .moa-count {
          display: flex;
          gap: clamp(0.4rem, 1.2vw, 0.75rem);
          margin-bottom: 3rem;
          justify-content: center;
        }

        @media (min-width: 900px) {
          .moa-count {
            justify-content: flex-start;
          }
        }

        .moa-count-unit {
          min-width: 52px;
          padding: 0.8rem 0.3rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          text-align: center;
          transition: border-color 0.5s var(--ease-out-expo);
        }

        .moa-count-unit:hover {
          border-color: rgba(201, 162, 39, 0.35);
        }

        .moa-count-num {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.5rem, 2.8vw, 2rem);
          font-weight: 500;
          color: #fff;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .moa-count-lbl {
          margin-top: 0.3rem;
          font-size: 8px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
        }

        /* Buttons — icon-in-circle pill pattern */
        .moa-buttons {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        @media (min-width: 900px) {
          .moa-buttons {
            justify-content: flex-start;
          }
        }

        .moa-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.4s var(--ease-out-expo);
          white-space: nowrap;
          cursor: pointer;
        }

        .moa-btn-primary {
          background: #fff;
          color: #000;
          padding: 3px 20px 3px 3px;
        }

        .moa-btn-primary .moa-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #000;
          color: #fff;
          flex-shrink: 0;
        }

        .moa-btn-primary:hover {
          background: #e2c471;
          transform: translateY(-2px);
        }

        .moa-btn-outline {
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          padding: 3px 20px 3px 3px;
        }

        .moa-btn-outline .moa-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          flex-shrink: 0;
        }

        .moa-btn-outline:hover {
          background: #fff;
          color: #000;
          border-color: #fff;
          transform: translateY(-2px);
        }

        .moa-btn-outline:hover .moa-btn-icon {
          background: #000;
          color: #fff;
        }

        /* Address */
        .moa-address {
          margin-top: 3.2rem;
          padding-top: 1.6rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 11px;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.35);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
        }

        @media (min-width: 900px) {
          .moa-address {
            justify-content: flex-start;
          }
        }

        .moa-address strong {
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        /* Visual column */
        .moa-visual {
          position: relative;
          min-height: 420px;
          overflow: hidden;
          background: #0a0a0a;
        }

        @media (min-width: 900px) {
          .moa-visual {
            min-height: 100%;
            border-left: 1px solid rgba(255, 255, 255, 0.05);
          }
        }

        .moa-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-color: #0a0a0a;
        }

        .moa-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          background:
            radial-gradient(circle at 30% 20%, rgba(201, 162, 39, 0.06), transparent 55%),
            radial-gradient(circle at 70% 80%, rgba(226, 196, 113, 0.04), transparent 55%),
            #0a0a0a;
        }

        .moa-placeholder-ring {
          width: 90px;
          height: 90px;
          border: 1px solid rgba(201, 162, 39, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .moa-placeholder-ring::before {
          content: '';
          position: absolute;
          inset: 5px;
          border: 1px solid rgba(201, 162, 39, 0.12);
          border-radius: 50%;
        }

        .moa-placeholder-ring svg {
          width: 36px;
          height: 36px;
        }

        .moa-placeholder-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: 1.25rem;
          color: #e2c471;
          margin-bottom: 0.4rem;
          font-weight: 500;
        }

        .moa-placeholder-sub {
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
        }

        /* Entrance animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .anim-fade-up {
          animation: fadeInUp 0.8s var(--ease-out-expo) forwards;
          opacity: 0;
        }

        .anim-d1 { animation-delay: 0.1s; }
        .anim-d2 { animation-delay: 0.25s; }
        .anim-d3 { animation-delay: 0.4s; }
        .anim-d4 { animation-delay: 0.55s; }
        .anim-d5 { animation-delay: 0.7s; }

        @media (prefers-reduced-motion: reduce) {
          .anim-fade-up {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>

      <div className="moa-grid">
        {/* Content */}
        <div className="moa-content">
          <div className="moa-eyebrow anim-fade-up anim-d1">
            <span className="moa-eyebrow-line" />
            Brand News
          </div>

          <h2 className="moa-title anim-fade-up anim-d2">
            {isOpen ? 'Now Open at Mall of America' : 'Coming to Mall of America'}
          </h2>

          <p className="moa-lede anim-fade-up anim-d3">
            After five years at Northtown Mall, SINZU expands to America&apos;s most iconic retail destination. Opening August 10, 2026, with statement jewelry, premium haircare, and culturally rooted skincare.
          </p>

          {!isOpen && (
            <div className="moa-count anim-fade-up anim-d4" aria-label="Countdown to opening">
              {[
                { n: d, l: 'Days' },
                { n: h, l: 'Hours' },
                { n: m, l: 'Min' },
                { n: s, l: 'Sec' },
              ].map((u) => (
                <div key={u.l} className="moa-count-unit">
                  <div className="moa-count-num">{String(u.n).padStart(2, '0')}</div>
                  <div className="moa-count-lbl">{u.l}</div>
                </div>
              ))}
            </div>
          )}

          <div className="moa-buttons anim-fade-up anim-d4">
            <Link href="/visit" className="moa-btn moa-btn-primary">
              <span className="moa-btn-icon">
                <Calendar size={14} strokeWidth={2} />
              </span>
              <span>Get Updates</span>
            </Link>
            <Link href="/visit" className="moa-btn moa-btn-outline">
              <span className="moa-btn-icon">
                <MapPin size={14} strokeWidth={2} />
              </span>
              <span>Our Stores</span>
            </Link>
          </div>

          <div className="moa-address anim-fade-up anim-d5">
            <MapPin size={12} strokeWidth={1.5} />
            <span>
              <strong>Now open</strong> at Northtown Mall, Blaine, MN
            </span>
          </div>
        </div>

        {/* Visual */}
        <div className="moa-visual">
          {!imageError ? (
            <>
              <img
                src="/moa-image.jpg"
                alt=""
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                style={{ display: 'none' }}
              />
              <div
                className="moa-image"
                style={{
                  backgroundImage: imageLoaded ? "url('/moa-image.jpg')" : undefined,
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.8s ease',
                }}
              />
              {!imageLoaded && <MOAPlaceholder />}
            </>
          ) : (
            <MOAPlaceholder />
          )}
        </div>
      </div>
    </section>
  );
}

function MOAPlaceholder() {
  return (
    <div className="moa-placeholder">
      <div className="moa-placeholder-ring">
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text
            x="18"
            y="27"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="24"
            fontWeight="600"
            fill="#e2c471"
          >
            $
          </text>
        </svg>
      </div>
      <div className="moa-placeholder-title">Mall of America</div>
      <div className="moa-placeholder-sub">Opening August 10, 2026</div>
    </div>
  );
}