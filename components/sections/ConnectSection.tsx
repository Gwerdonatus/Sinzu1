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
   SINZU — Connect section

   No cards, no icon chips — a quiet editorial block in the
   site's type system. Title pairs Marcellus with a gold
   Italianno script, then three entries (hours, email,
   Instagram) separated by fine gold hairlines: stacked on
   mobile, three columns on desktop. Links warm to bronze
   and grow a short gold underline on hover.

   Server component — hover states are pure CSS.
   ========================================================= */

const CSS = `
.szn{
  background:#fff;
  max-width:1020px; margin:0 auto;
  padding:clamp(3.5rem,9vw,6.5rem) clamp(1.25rem,4vw,3rem);
  text-align:center; color:#1A1713;
  font-family:var(--sz-sans),system-ui,sans-serif;
}

.szn-eyebrow{
  display:block;
  font-size:.68rem; font-weight:500;
  letter-spacing:.42em; text-indent:.42em; text-transform:uppercase;
  color:#B8862C;
  margin-bottom:1rem;
}
.szn-title{
  margin:0 0 clamp(2.25rem,6vw,3.75rem); line-height:1;
}
.szn-title-display{
  font-family:var(--sz-display),Georgia,serif; font-weight:400;
  font-size:clamp(2rem,5.5vw,3.2rem); letter-spacing:.02em;
}
.szn-title-script{
  font-family:var(--sz-script),cursive; font-weight:400;
  font-size:clamp(2.9rem,7.5vw,4.4rem); line-height:.7;
  color:#B8862C;
  margin-left:.18em; vertical-align:-.08em;
}

/* ---------- entries ---------- */
.szn-grid{
  display:grid; grid-template-columns:1fr;
  border-top:1px solid rgba(184,134,44,.3);
}
.szn-item{
  display:flex; flex-direction:column; align-items:center; gap:.55rem;
  padding:clamp(1.5rem,4vw,2.5rem) 1rem;
  border-bottom:1px solid rgba(184,134,44,.3);
  text-decoration:none; color:inherit;
}
.szn-item:focus-visible{ outline:2px solid #1A1713; outline-offset:-4px; }

.szn-label{
  font-size:.66rem; font-weight:500;
  letter-spacing:.32em; text-indent:.32em; text-transform:uppercase;
  color:#B8862C;
}
.szn-value{
  position:relative;
  font-family:var(--sz-display),Georgia,serif;
  font-size:clamp(1.05rem,2.6vw,1.3rem); letter-spacing:.03em;
  transition:color .35s ease;
}
.szn-value::after{ /* underline that grows on link hover */
  content:""; position:absolute; left:50%; bottom:-.35em;
  transform:translateX(-50%);
  width:0; height:1px; background:#B8862C;
  transition:width .45s cubic-bezier(.3,.7,.2,1);
}
a.szn-item:hover .szn-value{ color:#8F6415; }
a.szn-item:hover .szn-value::after{ width:100%; }

/* ---------- desktop: three columns ---------- */
@media (min-width:760px){
  .szn-grid{
    grid-template-columns:repeat(3,1fr);
    border-bottom:1px solid rgba(184,134,44,.3);
  }
  .szn-item{ border-bottom:none; }
  .szn-item + .szn-item{ border-left:1px solid rgba(184,134,44,.3); }
}

@media (prefers-reduced-motion:reduce){
  .szn-value,.szn-value::after{ transition:none; }
}
`;

export default function ConnectSection() {
  return (
    <section
      className={`szn ${marcellus.variable} ${italianno.variable} ${jost.variable}`}
      aria-label="Contact SINZU"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <span className="szn-eyebrow">Get in touch</span>
      <h3 className="szn-title">
        <span className="szn-title-display">Connect</span>
        <span className="szn-title-script">with us</span>
      </h3>

      <div className="szn-grid">
        <div className="szn-item">
          <span className="szn-label">Business hours</span>
          <span className="szn-value">M&ndash;F, 7am&ndash;10pm EST</span>
        </div>

        <Link href="mailto:info@sinzullc.com" className="szn-item">
          <span className="szn-label">Email</span>
          <span className="szn-value">info@sinzullc.com</span>
        </Link>

        <Link
          href="https://instagram.com/sinzu.llc"
          target="_blank"
          rel="noopener noreferrer"
          className="szn-item"
        >
          <span className="szn-label">Instagram</span>
          <span className="szn-value">@sinzu.llc</span>
        </Link>
      </div>
    </section>
  );
}