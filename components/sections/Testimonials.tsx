'use client';

/* =========================================================
   Testimonials — "In Their Words"

   Deliberately not the usual row of three identical cards.
   One review is given the weight of a magazine pull-quote and
   the rest sit beside it as a quieter column, so the eye lands
   somewhere instead of scanning three equal boxes.

   Detail carries the credibility: a real place under the name,
   the date, a verified mark, and an average computed from the
   actual reviews rather than a rounded-up marketing number.

   Reads data/reviews.json directly — same file the product
   pages use, so publishing a review updates both.
   ========================================================= */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Star, Check } from 'lucide-react';
import reviewsData from '@/data/reviews.json';

interface Testimonial {
  productId: string;
  reviewerName: string;
  location?: string;
  rating: number;
  title?: string;
  content: string;
  date: string;
  verified?: boolean;
}

const ALL: Testimonial[] = (reviewsData.reviews as Testimonial[]) ?? [];

/* The lead quote is the one that earns the space: highest rating,
   then the one with the most to say. */
const RANKED = [...ALL].sort(
  (a, b) => b.rating - a.rating || b.content.length - a.content.length
);
const LEAD = RANKED[0];
const SUPPORTING = RANKED.slice(1, 5);

const COUNT = ALL.length;
const AVERAGE = COUNT ? ALL.reduce((sum, r) => sum + r.rating, 0) / COUNT : 0;

function monthYear(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span
      className="tst-stars"
      aria-label={`${rating} out of 5 stars`}
      style={{ ['--s' as string]: `${size}px` }}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          strokeWidth={0}
          fill="currentColor"
          className={n <= Math.round(rating) ? 'tst-star-on' : 'tst-star-off'}
        />
      ))}
    </span>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  /* Reveal on scroll — but never at the cost of the content.
     This section is tall, and a threshold that never resolves would
     leave real testimonials invisible on a live shop. So: no observer
     means show immediately, and a timer reveals it regardless if the
     observer hasn't fired, whatever the page's scroll container does. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      // Start a little before the top edge arrives, and accept any sliver:
      // a section taller than the viewport can never reach a large ratio.
      { threshold: 0, rootMargin: '0px 0px -12% 0px' }
    );
    io.observe(el);

    const failsafe = window.setTimeout(() => setVisible(true), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  if (!LEAD) return null;

  return (
    <section ref={sectionRef} className={`tst ${visible ? 'tst-in' : ''}`} aria-labelledby="tst-heading">
      <style>{`
        .tst {
          position: relative;
          background:
            radial-gradient(120% 90% at 50% 0%, #ffffff 0%, #fbf9f6 45%, #f6f2ec 100%);
          padding: 68px 20px 76px;
          overflow: hidden;
        }
        /* Hairline top and bottom instead of a hard block edge */
        .tst::before, .tst::after {
          content: '';
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,162,39,0.28), transparent);
        }
        .tst::before { top: 0; }
        .tst::after { bottom: 0; }

        .tst-inner { max-width: 1120px; margin: 0 auto; }

        /* ── Header ── */
        .tst-head { text-align: center; margin-bottom: 40px; }
        .tst-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(26,18,0,0.45); font-weight: 600;
        }
        .tst-eyebrow::before, .tst-eyebrow::after {
          content: ''; width: 26px; height: 1px; background: rgba(201,162,39,0.5);
        }
        .tst-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 30px; font-weight: 700; color: #1a1200;
          line-height: 1.12; letter-spacing: -0.01em; margin: 14px 0 0;
        }
        .tst-title em { font-style: italic; font-weight: 400; }

        .tst-score {
          margin-top: 16px;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 7px 16px; border-radius: 999px;
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(26,18,0,0.07);
          box-shadow: 0 1px 2px rgba(26,18,0,0.03);
        }
        .tst-score-num { font-size: 13px; font-weight: 700; color: #1a1200; }
        .tst-score-meta { font-size: 12px; color: rgba(26,18,0,0.45); }
        .tst-score-sep { width: 1px; height: 12px; background: rgba(26,18,0,0.12); }

        /* ── Stars ── */
        .tst-stars { display: inline-flex; align-items: center; gap: 2px; line-height: 0; }
        .tst-star-on { color: #C9A227; }
        .tst-star-off { color: rgba(26,18,0,0.13); }

        /* ── Layout ── */
        .tst-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }

        /* ── Lead pull-quote ── */
        .tst-lead {
          position: relative;
          background: #fff;
          border: 1px solid rgba(26,18,0,0.07);
          border-radius: 18px;
          padding: 34px 26px 26px;
          box-shadow: 0 14px 40px -22px rgba(26,18,0,0.28);
          overflow: hidden;
        }
        /* Gold spine down the left edge */
        .tst-lead::after {
          content: ''; position: absolute; left: 0; top: 22px; bottom: 22px; width: 2px;
          background: linear-gradient(180deg, #C9A227, rgba(201,162,39,0.15));
          border-radius: 2px;
        }
        .tst-mark {
          position: absolute; top: -22px; right: 10px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 150px; line-height: 1; color: rgba(201,162,39,0.11);
          pointer-events: none; user-select: none;
        }
        .tst-lead-quote {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 21px; line-height: 1.45; color: #1a1200;
          font-style: italic; font-weight: 400; margin: 0 0 14px;
          position: relative;
        }
        .tst-lead-body {
          font-size: 14px; line-height: 1.8; color: rgba(26,18,0,0.62);
          margin: 0 0 22px; position: relative;
        }

        /* ── Attribution ── */
        .tst-by { display: flex; align-items: center; gap: 12px; position: relative; }
        .tst-avatar {
          width: 42px; height: 42px; border-radius: 999px; flex: none;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; letter-spacing: 0.06em;
          color: #6b5426;
          background: linear-gradient(135deg, #f3ead9, #e3d5bb);
          border: 1px solid rgba(201,162,39,0.28);
        }
        .tst-by-main { min-width: 0; }
        .tst-name {
          display: flex; align-items: center; gap: 7px; flex-wrap: wrap;
          font-size: 13.5px; font-weight: 600; color: #1a1200;
        }
        .tst-verified {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 9px; font-weight: 600; letter-spacing: 0.05em;
          text-transform: uppercase; color: #7a6420;
          background: rgba(201,162,39,0.13);
          border-radius: 999px; padding: 2px 7px;
        }
        .tst-place { font-size: 11.5px; color: rgba(26,18,0,0.42); margin-top: 2px; }

        /* ── Supporting column ── */
        .tst-side { display: grid; gap: 12px; }
        .tst-card {
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(26,18,0,0.06);
          border-radius: 14px;
          padding: 18px 18px 16px;
          transition: transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s, background .4s;
        }
        .tst-card:hover {
          background: #fff;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -20px rgba(26,18,0,0.3);
        }
        .tst-card-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 15px; font-style: italic; color: #1a1200;
          margin: 9px 0 7px; line-height: 1.35;
        }
        .tst-card-body {
          font-size: 12.5px; line-height: 1.7; color: rgba(26,18,0,0.55);
          margin: 0 0 14px;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .tst-card .tst-avatar { width: 32px; height: 32px; font-size: 10.5px; }
        .tst-card .tst-name { font-size: 12.5px; }
        .tst-card .tst-place { font-size: 10.5px; }

        /* ── Footer link ── */
        .tst-foot { text-align: center; margin-top: 34px; }
        .tst-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
          font-weight: 600; color: #1a1200; text-decoration: none;
          border-bottom: 1px solid rgba(201,162,39,0.55);
          padding-bottom: 4px; transition: color .3s, border-color .3s;
        }
        .tst-link:hover { color: #8a6d16; border-color: #C9A227; }

        /* ── Reveal ──
           Additive on purpose: the resting state is fully visible and the
           entrance is an animation layered on top. Nothing here can leave a
           testimonial invisible if the observer, the class or the JS fails —
           the worst case is that the content simply appears without motion. */
        @keyframes tstRise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: none; }
        }
        .tst-in .tst-rise { animation: tstRise .7s cubic-bezier(.22,1,.36,1) both; }
        .tst-in .tst-d1 { animation-delay: .06s; }
        .tst-in .tst-d2 { animation-delay: .13s; }
        .tst-in .tst-d3 { animation-delay: .2s; }
        .tst-in .tst-d4 { animation-delay: .27s; }

        /* Hidden by default; the mobile block below turns it on. Declared
           before that block — same specificity, so source order decides. */
        .tst-rail-hint { display: none; }

        /* ── Mobile: supporting reviews become a swipeable rail ── */
        @media (max-width: 767px) {
          .tst-side {
            grid-auto-flow: column;
            grid-auto-columns: 78%;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            /* bleed to the screen edge so it reads as a rail, not a clipped grid */
            margin: 0 -20px; padding: 2px 20px 6px;
          }
          .tst-side::-webkit-scrollbar { display: none; }
          .tst-card { scroll-snap-align: start; }
          .tst-rail-hint {
            display: block; text-align: center; margin-top: 10px;
            font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
            color: rgba(26,18,0,0.3);
          }
        }

        /* ── Desktop: asymmetric split ── */
        @media (min-width: 768px) {
          .tst { padding: 92px 32px 100px; }
          .tst-head { margin-bottom: 52px; }
          .tst-title { font-size: 42px; }
          .tst-grid { grid-template-columns: 1.15fr 1fr; gap: 22px; align-items: start; }
          /* Two-up so the supporting column stays close to the lead's
             height — stacked, four cards tower over it and the split
             reads as a mistake rather than a composition. */
          .tst-side { grid-template-columns: 1fr 1fr; }
          .tst-lead { padding: 44px 40px 34px; border-radius: 22px; }
          .tst-lead-quote { font-size: 27px; }
          .tst-lead-body { font-size: 14.5px; }
          .tst-mark { font-size: 200px; top: -32px; right: 18px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .tst-in .tst-rise { animation: none; }
          .tst-card { transition: none; }
        }
      `}</style>

      <div className="tst-inner">
        <header className="tst-head">
          <p className="tst-eyebrow tst-rise">In their words</p>
          <h2 id="tst-heading" className="tst-title tst-rise tst-d1">
            Five years of <em>Sinzu Babes</em>
          </h2>
          {COUNT > 0 && (
            <div className="tst-score tst-rise tst-d2">
              <Stars rating={AVERAGE} size={13} />
              <span className="tst-score-num">{AVERAGE.toFixed(1)}</span>
              <span className="tst-score-sep" />
              <span className="tst-score-meta">
                {COUNT} verified review{COUNT === 1 ? '' : 's'}
              </span>
            </div>
          )}
        </header>

        <div className="tst-grid">
          {/* Lead pull-quote */}
          <figure className="tst-lead tst-rise tst-d1">
            <span className="tst-mark" aria-hidden="true">&ldquo;</span>
            <Stars rating={LEAD.rating} size={14} />
            {LEAD.title && (
              <blockquote className="tst-lead-quote">&ldquo;{LEAD.title}&rdquo;</blockquote>
            )}
            <p className="tst-lead-body">{LEAD.content}</p>
            <figcaption className="tst-by">
              <span className="tst-avatar" aria-hidden="true">{initials(LEAD.reviewerName)}</span>
              <span className="tst-by-main">
                <span className="tst-name">
                  {LEAD.reviewerName}
                  {LEAD.verified && (
                    <span className="tst-verified">
                      <Check size={9} strokeWidth={3} /> Verified
                    </span>
                  )}
                </span>
                <span className="tst-place">
                  {LEAD.location ? `${LEAD.location} · ` : ''}
                  {monthYear(LEAD.date)}
                </span>
              </span>
            </figcaption>
          </figure>

          {/* Supporting reviews */}
          <div className="tst-side tst-rise tst-d3">
            {SUPPORTING.map((r, i) => (
              <figure className="tst-card" key={`${r.reviewerName}-${i}`}>
                <Stars rating={r.rating} size={11} />
                {r.title && <p className="tst-card-title">&ldquo;{r.title}&rdquo;</p>}
                <p className="tst-card-body">{r.content}</p>
                <figcaption className="tst-by">
                  <span className="tst-avatar" aria-hidden="true">{initials(r.reviewerName)}</span>
                  <span className="tst-by-main">
                    <span className="tst-name">
                      {r.reviewerName}
                      {r.verified && (
                        <span className="tst-verified">
                          <Check size={8} strokeWidth={3} /> Verified
                        </span>
                      )}
                    </span>
                    <span className="tst-place">
                      {r.location ? `${r.location} · ` : ''}
                      {monthYear(r.date)}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <span className="tst-rail-hint" aria-hidden="true">Swipe for more</span>

        <div className="tst-foot tst-rise tst-d4">
          <Link href="/shop" className="tst-link">
            Shop the collection
          </Link>
        </div>
      </div>
    </section>
  );
}
