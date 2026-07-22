import Image from 'next/image';
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
   SINZU — Featured collection banner ("SINZU Body")

   Clean editorial split. Desktop: photograph left with a
   fine gold inset ring, text right on white — eyebrow,
   two-word title (Marcellus + gold Italianno script), one
   CTA. Mobile: text stacked above the full, uncropped
   image. Same type system and gold language as the
   collections panels, so the page reads as one design.

   Server component — the hover states are pure CSS.
   Props unchanged from the previous version: drop-in.
   ========================================================= */

interface CategoryBannersProps {
  productImage?: string;
  href?: string;
  alt?: string;
}

const CSS = `
.szb-wrap{
  width:100%; background:#fff;
  font-family:var(--sz-sans),system-ui,sans-serif;
}
.szb{
  display:flex; flex-direction:column;
  max-width:1440px; margin:0 auto;
  text-decoration:none; color:#1A1713;
}
.szb:focus-visible{ outline:2px solid #1A1713; outline-offset:4px; }

/* ---------- image ---------- */
.szb-media{
  position:relative; order:2;
  width:100%; aspect-ratio:4/3; overflow:hidden;
}
.szb-photo{
  object-fit:cover;
  transition:transform 1.2s cubic-bezier(.2,.6,.2,1);
}
.szb-media::after{ /* fine gold inset ring */
  content:""; position:absolute; inset:14px; z-index:1;
  border:1px solid rgba(217,166,60,.55);
  pointer-events:none;
}
.szb:hover .szb-photo{ transform:scale(1.03); }

/* ---------- text ---------- */
.szb-text{
  order:1;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center; text-align:center;
  padding:clamp(2.5rem,8vw,4rem) 1.5rem;
}
.szb-eyebrow{
  font-size:.68rem; font-weight:500;
  letter-spacing:.42em; text-indent:.42em; text-transform:uppercase;
  color:#B8862C;
  margin-bottom:clamp(.9rem,2vw,1.4rem);
}
.szb-title{ margin:0; line-height:1; }
.szb-title-display{
  display:block;
  font-family:var(--sz-display),Georgia,serif; font-weight:400;
  font-size:clamp(2.6rem,7vw,4.9rem);
  letter-spacing:.1em; text-indent:.1em;
}
.szb-title-script{
  display:block;
  font-family:var(--sz-script),cursive; font-weight:400;
  font-size:clamp(3.2rem,8.5vw,6rem); line-height:.75;
  margin-top:-.06em;
  color:#B8862C;
  transform:translateX(.06em); /* optical centering for the swash */
}
.szb-cta{
  display:inline-flex; align-items:center; gap:.7rem;
  margin-top:clamp(1.6rem,3.5vw,2.4rem);
  font-size:.7rem; font-weight:500;
  letter-spacing:.34em; text-transform:uppercase;
  color:#B8862C;
  transition:color .35s ease;
}
.szb-cta-line{
  display:inline-block; width:2.5rem; height:1px;
  background:currentColor;
  transition:width .45s cubic-bezier(.3,.7,.2,1);
}
.szb:hover .szb-cta{ color:#8F6415; }
.szb:hover .szb-cta-line{ width:4.25rem; }

/* ---------- desktop split ---------- */
@media (min-width:820px){
  .szb{
    display:grid; grid-template-columns:11fr 9fr;
    min-height:clamp(460px,46vw,620px);
  }
  .szb-media{ order:1; aspect-ratio:auto; height:100%; }
  .szb-text{ order:2; padding:3rem clamp(2rem,5vw,5rem); }
}

@media (prefers-reduced-motion:reduce){
  .szb-photo,.szb-cta,.szb-cta-line{ transition:none; }
  .szb:hover .szb-photo{ transform:none; }
}
`;

export default function CategoryBanners({
  productImage = '/images/your-products.png',
  href = '/collections/all',
  alt = 'Shop SINZU Body',
}: CategoryBannersProps) {
  return (
    <section className={`szb-wrap ${marcellus.variable} ${italianno.variable} ${jost.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <Link href={href} className="szb" aria-label={alt}>
        <div className="szb-media">
          <Image
            src={productImage}
            alt={alt}
            fill
            sizes="(min-width: 820px) 55vw, 100vw"
            className="szb-photo"
          />
        </div>

        <div className="szb-text">
          <span className="szb-eyebrow">Featured collection</span>
          <h2 className="szb-title">
            <span className="szb-title-display">SINZU</span>
            <span className="szb-title-script">BABES</span>
          </h2>
          <span className="szb-cta">
            Shop now
            <span className="szb-cta-line" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </section>
  );
}