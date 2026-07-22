'use client';

import { Shield, Truck, Store, Sparkles, HeadphonesIcon } from 'lucide-react';

/* =========================================================
   Trust Bar — retail credibility strip.
   Black icon circles, editorial spacing, pure monochrome
   with restrained gold reserved only for the headline.
   ========================================================= */

const ITEMS = [
  {
    icon: Sparkles,
    title: 'Five Years Strong',
    body: 'A trusted Minnesota retail brand since 2021',
  },
  {
    icon: Store,
    title: 'Shop In Person',
    body: 'Northtown Mall today · Mall of America Aug 2026',
  },
  {
    icon: Truck,
    title: 'Ships Nationwide',
    body: 'Free U.S. shipping on orders over $150',
  },
  {
    icon: Shield,
    title: 'Secure Checkout',
    body: 'Powered by Square · Apple Pay & all major cards',
  },
  {
    icon: HeadphonesIcon,
    title: 'Easy Support',
    body: 'Real people at +1 612-487-8228',
  },
];

export default function TrustBar() {
  return (
    <section className="sinzu-trust" aria-label="Why shop with SINZU">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500&display=swap');

        .sinzu-trust{
          background:#fff;
          border-top:1px solid rgba(0,0,0,.06);
          font-family:'Inter','Helvetica Neue',sans-serif;
          padding:clamp(56px,7vw,96px) clamp(20px,5vw,60px);
        }
        .st-inner{ max-width:1100px; margin:0 auto; }

        /* Mobile: 2-col flex so the 5th item centers naturally */
        .st-grid{
          display:flex;
          flex-wrap:wrap;
          justify-content:center;
          gap:clamp(2rem,4vw,3.5rem) clamp(1.25rem,3vw,2rem);
        }
        .st-item{
          flex:0 1 calc(50% - 1rem);
          max-width:190px;
          text-align:center;
          transition:transform .5s cubic-bezier(.22,1,.36,1);
        }
        .st-item:hover{ transform:translateY(-3px); }

        .st-icon-wrap{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          width:44px; height:44px;
          margin-bottom:1.1rem;
          border-radius:50%;
          background:#000;
          color:#fff;
          transition:all .5s cubic-bezier(.22,1,.36,1);
        }
        .st-item:hover .st-icon-wrap{
          background:#1a1a1a;
          transform:scale(1.08);
        }

        .st-title{
          font-family:'Playfair Display',Georgia,serif;
          font-size:14px;
          font-weight:500;
          color:#000;
          letter-spacing:-.01em;
          margin-bottom:.4rem;
          line-height:1.3;
        }
        .st-body{
          font-size:11px;
          line-height:1.6;
          color:rgba(0,0,0,.45);
          letter-spacing:.01em;
        }

        /* Desktop: true 5-column grid */
        @media (min-width:768px){
          .st-grid{
            display:grid;
            grid-template-columns:repeat(5,1fr);
            gap:2.5rem;
          }
          .st-item{
            flex:none;
            max-width:none;
          }
          .st-title{ font-size:15px; }
          .st-body{ font-size:12px; }
        }
      `}</style>

      <div className="st-inner">
        <div className="st-grid">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="st-item">
                <div className="st-icon-wrap">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <div className="st-title">{item.title}</div>
                <div className="st-body">{item.body}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}