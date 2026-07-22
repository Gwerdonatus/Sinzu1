'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
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
   SINZU — "Show off your glow" customer photos

   The polaroid metaphor stays — taped-up customer shots is
   the right feel for UGC — but restyled into the site's
   system: white ground, Marcellus + gold Italianno title,
   gold micro-labels, no icons or shimmer washes.

   Motion, all scroll-linked like the collections panels:
   - the title ghost-fills left-to-right as you scroll in
     (ink for the display line, gold for the script line)
   - the four polaroids rise, fade, and twist into their
     resting tilt one after another
   - hover straightens and lifts a polaroid (CSS only)
   Reduced motion renders everything settled.
   ========================================================= */

type Photo = { src: string; alt: string; tilt: string; delay: number };

const PHOTOS: Photo[] = [
  {
    src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=360&h=440&fit=crop',
    alt: 'Glowing skin',
    tilt: '-3deg',
    delay: 0,
  },
  {
    src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=360&h=440&fit=crop',
    alt: 'Styled jewelry',
    tilt: '2.5deg',
    delay: 0.12,
  },
  {
    src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=360&h=440&fit=crop',
    alt: 'Hair care routine',
    tilt: '-2.5deg',
    delay: 0.24,
  },
  {
    src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=360&h=440&fit=crop',
    alt: 'Beauty essentials',
    tilt: '3deg',
    delay: 0.36,
  },
];

const CSS = `
.szg{
  background:#fff; color:#1A1713;
  padding:clamp(3.5rem,9vw,6.5rem) clamp(1.25rem,4vw,3rem);
  text-align:center; overflow:hidden;
  font-family:var(--sz-sans),system-ui,sans-serif;
}
.szg-inner{ max-width:900px; margin:0 auto; }

/* ---------- title: scroll-linked ghost fill ---------- */
.szg-line{
  position:relative; display:block; white-space:nowrap;
  transform:translateY(calc((1 - var(--p1,0)) * 22px));
}
.szg-line-fill{ position:absolute; inset:0; pointer-events:none; }

.szg-display{
  font-family:var(--sz-display),Georgia,serif; font-weight:400;
  font-size:clamp(1.9rem,6vw,3.4rem); line-height:1.05;
  letter-spacing:.09em; text-indent:.09em; text-transform:uppercase;
  color:rgba(26,23,19,.13);
}
.szg-display .szg-line-fill{
  color:#1A1713;
  clip-path:inset(-0.15em calc((1 - var(--p1,0)) * 100%) -0.15em 0);
}
.szg-script{
  font-family:var(--sz-script),cursive; font-weight:400;
  font-size:clamp(3.6rem,11vw,6.4rem); line-height:.72;
  margin-top:.02em;
  color:rgba(184,134,44,.18);
  transform:translateY(calc((1 - var(--p2,0)) * 26px));
}
.szg-script .szg-line-fill{
  color:#B8862C;
  clip-path:inset(-0.3em calc((1 - var(--p2,0)) * 100%) -0.35em 0);
}

/* handle */
.szg-handle{
  display:inline-block;
  margin:clamp(1.1rem,3vw,1.6rem) 0 clamp(2.25rem,6vw,3.5rem);
  font-size:.72rem; font-weight:500;
  letter-spacing:.32em; text-indent:.32em; text-transform:uppercase;
  color:#B8862C; text-decoration:none;
  opacity:var(--p2,0);
  transform:translateY(calc((1 - var(--p2,0)) * 12px));
  transition:color .35s ease;
}
.szg-handle:hover{ color:#8F6415; }
.szg-handle:focus-visible{ outline:2px solid #1A1713; outline-offset:4px; }

/* ---------- polaroids: staggered scroll-in ---------- */
.szg-grid{
  display:grid; grid-template-columns:repeat(2,1fr);
  gap:clamp(1rem,3.5vw,1.6rem);
  max-width:540px; margin:0 auto;
}
@media (min-width:820px){
  .szg-grid{ grid-template-columns:repeat(4,1fr); max-width:1020px; }
}

.szg-card{
  /* per-card progress: the grid's --gp minus this card's delay */
  --pi:clamp(0, calc((var(--gp,0) - var(--d,0)) * 2.4), 1);
  position:relative;
  background:#fff;
  padding:clamp(.5rem,1.2vw,.7rem);
  padding-bottom:clamp(2rem,4vw,2.8rem);
  border-radius:3px;
  box-shadow:0 8px 30px rgba(0,0,0,.08), 0 2px 8px rgba(0,0,0,.04);
  opacity:var(--pi);
  transform:
    translateY(calc((1 - var(--pi)) * 44px))
    rotate(calc(var(--pi) * var(--tilt,0deg)));
  transition:transform .45s cubic-bezier(.22,1,.36,1),
             box-shadow .45s cubic-bezier(.22,1,.36,1);
}
.szg-card:hover{
  transform:translateY(-8px) rotate(0deg);
  box-shadow:0 20px 50px rgba(0,0,0,.12), 0 8px 20px rgba(184,134,44,.16);
  z-index:1;
}
.szg-tape{
  position:absolute; top:-8px; left:50%;
  transform:translateX(-50%) rotate(-1.5deg);
  width:42px; height:16px;
  background:rgba(217,166,60,.3);
  border:1px solid rgba(217,166,60,.18);
  border-radius:2px; z-index:2;
}
.szg-img{
  width:100%; aspect-ratio:9/11;
  object-fit:cover; display:block; border-radius:2px;
}
.szg-caption{
  position:absolute; left:0; right:0;
  bottom:clamp(.55rem,1.2vw,.85rem);
  font-size:.6rem; font-weight:500;
  letter-spacing:.2em; text-transform:uppercase;
  color:#B8862C;
}

@media (prefers-reduced-motion:reduce){
  .szg-card{ transition:none; }
  .szg-card:hover{ transform:rotate(var(--tilt,0deg)); }
  .szg-handle{ transition:none; }
}
`;

export default function ShowLooksSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const settle = () => {
      el.style.setProperty('--p1', '1');
      el.style.setProperty('--p2', '1');
      el.style.setProperty('--gp', '1');
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      settle();
      return;
    }

    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const raw = (vh * 0.92 - r.top) / (vh * 0.55);
      const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
      el.style.setProperty('--p1', clamp01(raw).toFixed(4));
      el.style.setProperty('--p2', clamp01(raw * 1.3 - 0.25).toFixed(4));
      el.style.setProperty('--gp', clamp01(raw * 1.1 - 0.15).toFixed(4));
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
    <section ref={root} className={`szg ${marcellus.variable} ${italianno.variable} ${jost.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="szg-inner">
        <h2 style={{ margin: 0 }}>
          <span className="szg-line szg-display" aria-hidden="true">
            Show off your
            <span className="szg-line-fill">Show off your</span>
          </span>
          <span className="szg-line szg-script" aria-hidden="true">
            Glow
            <span className="szg-line-fill">Glow</span>
          </span>
          <span
            style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}
          >
            Show off your glow
          </span>
        </h2>

        <Link
          href="https://instagram.com/sinzu.llc"
          target="_blank"
          rel="noopener noreferrer"
          className="szg-handle"
        >
          Tag @sinzu.llc
        </Link>

        <div className="szg-grid">
          {PHOTOS.map((photo) => (
            <figure
              key={photo.src}
              className="szg-card"
              style={{ ['--tilt' as string]: photo.tilt, ['--d' as string]: photo.delay, margin: 0 }}
            >
              <span className="szg-tape" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.alt} className="szg-img" loading="lazy" />
              <figcaption className="szg-caption">{photo.alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}