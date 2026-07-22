'use client';

import { useEffect, useRef } from 'react';

const marcellus = { className: '', variable: '' };

const italianno = { className: '', variable: '' };

/* =========================================================
   SINZU — cinematic band (video section)

   Full-bleed mood moment: a muted looping video when you
   have one, the image otherwise. The title is the same
   ghost-fill pairing as the rest of the page — Marcellus
   display line, Italianno script line trailing in — filled
   by scroll position. Nothing else on the band; it's a
   breath between sections, not another pitch.

   Pass a videoSrc (mp4/webm) when the client has brand
   footage; imageSrc doubles as the poster. Reduced motion
   renders the title filled and swaps the video for the
   still image.
   ========================================================= */

interface VideoSectionProps {
  videoSrc?: string;
  imageSrc?: string;
  alt?: string;
  /** Clean display line (Marcellus). */
  display?: string;
  /** Flowing script line (Italianno). */
  script?: string;
}

const CSS = `
.szv{
  position:relative; overflow:hidden;
  height:clamp(340px,58svh,600px);
  display:flex; align-items:center; justify-content:center;
  background:#1A1208;
  font-family:var(--sz-display),Georgia,serif;
}
.szv-media{
  position:absolute; inset:0;
  width:100%; height:100%; object-fit:cover;
}
.szv-scrim{
  position:absolute; inset:0;
  background:linear-gradient(180deg,
    rgba(10,6,2,.36) 0%, rgba(10,6,2,.18) 45%, rgba(10,6,2,.46) 100%);
}

.szv-body{ position:relative; z-index:1; text-align:center; padding:0 1.25rem; }

.szv-line{
  position:relative; display:block; white-space:nowrap;
  transform:translateY(calc((1 - var(--p1,0)) * 24px));
}
.szv-line-fill{ position:absolute; inset:0; color:#fff; pointer-events:none; }

.szv-display{
  font-family:var(--sz-display),Georgia,serif; font-weight:400;
  font-size:clamp(1.9rem,6.5vw,3.9rem); line-height:1.05;
  letter-spacing:.14em; text-indent:.14em; text-transform:uppercase;
  color:rgba(255,255,255,.2);
}
.szv-display .szv-line-fill{
  clip-path:inset(-0.15em calc((1 - var(--p1,0)) * 100%) -0.15em 0);
}
.szv-script{
  font-family:var(--sz-script),cursive; font-weight:400;
  font-size:clamp(3.6rem,12vw,7.5rem); line-height:.72;
  margin-top:.04em;
  color:rgba(255,255,255,.2);
  transform:translateY(calc((1 - var(--p2,0)) * 30px));
}
.szv-script .szv-line-fill{
  clip-path:inset(-0.3em calc((1 - var(--p2,0)) * 100%) -0.35em 0);
}

/* short gold rule beneath, riding the script's progress */
.szv-rule{
  display:block; height:1px; margin:1.4rem auto 0;
  width:calc(var(--p2,0) * 3.5rem);
  background:#D9A63C;
}
`;

export default function VideoSection({
  videoSrc,
  imageSrc = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&h=1000&fit=crop',
  alt = 'SINZU',
  display = 'The SINZU',
  script = 'experience',
}: VideoSectionProps) {
  const root = useRef<HTMLElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reduced.current = true;
      el.style.setProperty('--p1', '1');
      el.style.setProperty('--p2', '1');
      // pause the loop for reduced-motion users
      el.querySelector('video')?.pause();
      return;
    }

    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const raw = (vh * 0.92 - r.top) / (vh * 0.5);
      const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
      el.style.setProperty('--p1', clamp01(raw).toFixed(4));
      el.style.setProperty('--p2', clamp01(raw * 1.3 - 0.3).toFixed(4));
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
    <section ref={root} className={`szv ${marcellus.variable} ${italianno.variable}`} aria-label={alt}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {videoSrc ? (
        <video
          className="szv-media"
          src={videoSrc}
          poster={imageSrc}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageSrc} alt="" className="szv-media" aria-hidden="true" />
      )}
      <div className="szv-scrim" aria-hidden="true" />

      <div className="szv-body">
        <span className="szv-line szv-display" aria-hidden="true">
          {display}
          <span className="szv-line-fill">{display}</span>
        </span>
        <span className="szv-line szv-script" aria-hidden="true">
          {script}
          <span className="szv-line-fill">{script}</span>
        </span>
        <span
          style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}
        >
          {display} {script}
        </span>
        <span className="szv-rule" aria-hidden="true" />
      </div>
    </section>
  );
}