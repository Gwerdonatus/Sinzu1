'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Marcellus, Italianno, Jost } from 'next/font/google';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--sz-display',
});

const italianno = Italianno({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--sz-script',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--sz-sans',
});

/* =========================================================
   SINZU — Collections section, v3

   Direction: editorial campaign panels, after the client's
   reference. Three full-bleed photographs, each carrying a
   two-line title — a clean display word (Marcellus) over a
   flowing script word (Italianno) — with a small caption
   and a gold shop cue.

   Motion lives entirely in the type: each line renders as
   a ghost and fills with white left-to-right as the panel
   scrolls into view, the script line trailing the display
   line. Scroll-linked (tied to position, not a one-shot
   trigger), dependency-free, rAF-throttled. Reduced motion
   renders everything filled and still.

   Drop the generated photography into `image` per panel;
   until then a warm dark gradient stands in so the type
   still reads.
   ========================================================= */

type Panel = {
  href: string;
  /** Clean display line (Marcellus). */
  display: string;
  /** Flowing script line (Italianno). */
  script: string;
  /** Small caption under the title — swap for the client's real range. */
  caption: string;
  /** Gold micro-CTA. */
  cta: string;
  /** Text block alignment, for editorial rhythm across the three panels. */
  align: 'center' | 'start' | 'end';
  /** Path or remote URL for the panel photo. Optional until uploaded. */
  image?: string;
  alt?: string;
  /** Fallback gradient, top -> bottom, while photos are pending. */
  tone: [string, string];
};

const PANELS: Panel[] = [
  {
    href: '/collections/jewelry',
    display: 'Jewelries',
    script: 'timeless',
    caption: 'Everyday & statement pieces, made to be kept.',
    cta: 'Shop jewelries',
    align: 'center',
    tone: ['#2A1C0C', '#4A3212'],
    image: '/collections/jewelries.png',
    alt: 'Model in gold layered necklaces, golden hour light',
  },
  {
    href: '/collections/skincare',
    display: 'Skin',
    script: 'Care',
    caption: 'Cleansers, serums & glow essentials.',
    cta: 'Shop skin care',
    align: 'start',
    tone: ['#2B170E', '#54311C'],
    image: '/collections/skin-care.png',
    alt: 'Dewy skin with serum dropper in warm light',
  },
  {
    href: '/collections/haircare',
    display: 'Hair',
    script: 'Care',
    caption: 'Oils, treatments & everyday care.',
    cta: 'Shop hair care',
    align: 'end',
    tone: ['#211509', '#463113'],
    image: '/collections/hair-care.png',
    alt: 'Textured hair glistening in golden light',
  },
];

const CSS = `
.szc{
  --gold:#D9A63C;
  --gold-deep:#B8862C;
  background:#fff;
  font-family:var(--sz-sans),system-ui,sans-serif;
}

/* ---------- panels ---------- */
.szp{
  position:relative; display:flex; overflow:hidden;
  height:clamp(480px,76svh,720px);
  text-decoration:none; color:#fff;
}
@media (min-width:820px){
  .szp{ height:clamp(560px,88svh,860px); }
}
.szp:focus-visible{ outline:3px solid #fff; outline-offset:-6px; }

.szp-media{ position:absolute; inset:0; }
.szp-photo{ object-fit:cover; }
.szp-scrim{
  position:absolute; inset:0;
  background:linear-gradient(180deg,
    rgba(10,6,2,.34) 0%, rgba(10,6,2,.16) 42%,
    rgba(10,6,2,.3) 72%, rgba(10,6,2,.58) 100%);
}

/* text block */
.szp-body{
  position:relative; z-index:1;
  display:flex; flex-direction:column; justify-content:center;
  width:100%; padding:2rem clamp(1.25rem,6vw,5rem);
}
.szp--center .szp-body{ align-items:center; text-align:center; }
.szp--start  .szp-body{ align-items:flex-start; text-align:left; }
.szp--end    .szp-body{ align-items:flex-end; text-align:right; }

/* ---------- the two title lines ----------
   Each line is a ghost with an absolutely-positioned filled
   copy clipped by scroll progress: --p1 drives the display
   line, --p2 trails it on the script line. */
.szp-line{
  position:relative; display:block; white-space:nowrap;
  transform:translateY(calc((1 - var(--p1,0)) * 28px));
}
.szp-line-fill{
  position:absolute; inset:0; color:#fff; pointer-events:none;
}

.szp-display{
  font-family:var(--sz-display),Georgia,serif; font-weight:400;
  font-size:clamp(3.1rem,14vw,8.75rem); line-height:.98;
  letter-spacing:.015em;
  color:rgba(255,255,255,.17);
}
.szp-display .szp-line-fill{
  clip-path:inset(-0.15em calc((1 - var(--p1,0)) * 100%) -0.15em 0);
}

.szp-script{
  font-family:var(--sz-script),cursive; font-weight:400;
  font-size:clamp(3.9rem,17vw,10.5rem); line-height:.8;
  margin-top:-.08em;
  color:rgba(255,255,255,.17);
  transform:translateY(calc((1 - var(--p2,0)) * 34px));
}
.szp-script .szp-line-fill{
  clip-path:inset(-0.3em calc((1 - var(--p2,0)) * 100%) -0.35em 0);
}
/* the script line drifts off-axis, like the reference */
.szp--center .szp-script{ margin-left:14%; }
.szp--start  .szp-script{ margin-left:18%; }
.szp--end    .szp-script{ margin-right:16%; }

/* caption + gold cue fade in on the script's progress */
.szp-caption{
  max-width:34ch;
  margin-top:clamp(1.1rem,3vw,1.8rem);
  font-size:.82rem; font-weight:400; line-height:1.65;
  letter-spacing:.06em; color:rgba(255,255,255,.85);
  opacity:var(--p2,0);
  transform:translateY(calc((1 - var(--p2,0)) * 14px));
}
.szp-cta{
  display:inline-flex; align-items:center; gap:.7rem;
  margin-top:1.1rem;
  font-size:.68rem; font-weight:500;
  letter-spacing:.34em; text-transform:uppercase;
  color:var(--gold);
  opacity:var(--p2,0);
  transform:translateY(calc((1 - var(--p2,0)) * 14px));
}
.szp-cta-line{
  display:inline-block; width:2.4rem; height:1px;
  background:currentColor;
  transition:width .45s cubic-bezier(.3,.7,.2,1);
}
.szp:hover .szp-cta{ color:#F3D580; }
.szp:hover .szp-cta-line{ width:4rem; }

/* ---------- "shop everything" strip ---------- */
.szc-all{
  display:flex; align-items:baseline; justify-content:center;
  flex-wrap:wrap; gap:.5rem 1.5rem;
  max-width:1020px;
  margin:0 auto; padding:1.4rem 1rem;
  border-bottom:1px solid rgba(184,134,44,.28);
  text-decoration:none; color:#1A1713;
}
.szc-all:focus-visible{ outline:2px solid #1A1713; outline-offset:4px; }
.szc-all-lead{
  font-family:var(--sz-script),cursive; font-weight:400;
  font-size:clamp(1.7rem,4.5vw,2.2rem); line-height:1;
}
.szc-all-cta{
  display:inline-flex; align-items:center; gap:.7rem;
  font-size:.7rem; font-weight:500;
  letter-spacing:.32em; text-transform:uppercase;
  color:var(--gold-deep); white-space:nowrap;
  transition:color .35s ease;
}
.szc-all-line{
  display:inline-block; width:2.5rem; height:1px;
  background:currentColor;
  transition:width .45s cubic-bezier(.3,.7,.2,1);
}
.szc-all:hover .szc-all-cta{ color:#8F6415; }
.szc-all:hover .szc-all-line{ width:4.25rem; }

@media (prefers-reduced-motion:reduce){
  .szp-cta-line,.szc-all-line,.szc-all-cta{ transition:none; }
}
`;

export default function CategoryBanners() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const panels = Array.from(el.querySelectorAll<HTMLElement>('.szp'));

    const settle = () => {
      for (const p of panels) {
        p.style.setProperty('--p1', '1');
        p.style.setProperty('--p2', '1');
      }
    };

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      settle();
      return;
    }

    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const p of panels) {
        const r = p.getBoundingClientRect();
        // fill starts when the panel's top passes 92% of the viewport
        // and completes over roughly half a viewport of travel
        const raw = (vh * 0.92 - r.top) / (vh * 0.55);
        const p1 = Math.min(1, Math.max(0, raw));
        const p2 = Math.min(1, Math.max(0, raw * 1.3 - 0.32));
        p.style.setProperty('--p1', p1.toFixed(4));
        p.style.setProperty('--p2', p2.toFixed(4));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <section
        ref={root}
        className={`szc ${marcellus.variable} ${italianno.variable} ${jost.variable}`}
        aria-label="Shop by category"
      >
        {PANELS.map((p) => (
          <Link key={p.href} href={p.href} className={`szp szp--${p.align}`} aria-label={p.cta}>
            <div className="szp-media" aria-hidden="true">
              {p.image ? (
                <Image src={p.image} alt="" fill sizes="100vw" className="szp-photo" />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(180deg, ${p.tone[0]}, ${p.tone[1]})`,
                  }}
                />
              )}
              <div className="szp-scrim" />
            </div>

            <div className="szp-body">
              <span className="szp-line szp-display" aria-hidden="true">
                {p.display}
                <span className="szp-line-fill">{p.display}</span>
              </span>
              <span className="szp-line szp-script" aria-hidden="true">
                {p.script}
                <span className="szp-line-fill">{p.script}</span>
              </span>
              {/* the visible title is decorative twice-over; screen readers get this */}
              <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                {p.display} {p.script}
              </span>

              <p className="szp-caption">{p.caption}</p>
              <span className="szp-cta">
                {p.cta}
                <span className="szp-cta-line" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
        <br />
      </section>
    </>
  );
}