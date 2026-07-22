'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/* =========================================================
   SINZU — Rotating announcement bar.
   Three messages cycle every 5s. Pure black bar with
   restrained gold accents. Single-line on all breakpoints.
   ========================================================= */
const MESSAGES: { text: React.ReactNode; href?: string }[] = [
  {
    text: (
      <>
        <span className="ab-gold">NOW OPENING</span>
        <span className="ab-sep">/</span>
        SINZU at Mall of America
        <span className="ab-sep">/</span>
        August 10
      </>
    ),
    href: '/visit',
  },
  {
    text: (
      <>
        Free U.S. shipping on orders over $150
        <span className="ab-sep">/</span>
        Ships Nationwide
      </>
    ),
    href: '/shipping-info',
  },
  {
    text: (
      <>
        <span className="ab-gold">MOA15</span>
        <span className="ab-sep">/</span>
        15% off your order
      </>
    ),
    href: '/shop',
  },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = MESSAGES[index];

  const body = (
    <span
      className="ab-message"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity .4s ease' }}
    >
      {current.text}
    </span>
  );

  return (
    <div className="sinzu-announcement" role="region" aria-label="Announcements">
      <style>{`
        .sinzu-announcement{
          position:relative;
          overflow:hidden;
          background:#000;
          color:#fff;
          padding:10px 16px;
          text-align:center;
          font-family:'Inter','Helvetica Neue',sans-serif;
          font-size:11px;
          letter-spacing:0.12em;
          text-transform:uppercase;
          white-space:nowrap;
        }
        .ab-message{
          display:inline-flex;
          align-items:center;
          gap:0.5em;
          line-height:1;
        }
        .ab-gold{
          background:linear-gradient(90deg,#c9a227 0%,#f5e7a3 50%,#c9a227 100%);
          -webkit-background-clip:text;
          background-clip:text;
          -webkit-text-fill-color:transparent;
          color:transparent;
          font-weight:600;
          letter-spacing:0.15em;
        }
        .ab-sep{
          opacity:0.35;
          margin:0 0.2em;
          font-weight:300;
        }
        .sinzu-announcement a{
          color:inherit;
          text-decoration:none;
          display:block;
        }
        .sinzu-announcement a:hover .ab-message{
          opacity:0.75;
        }

        /* Mobile: keep it compact and single-line */
        @media (max-width: 767px){
          .sinzu-announcement{
            font-size:10px;
            letter-spacing:0.1em;
            padding:8px 12px;
          }
          .ab-gold{ letter-spacing:0.12em; }
        }
      `}</style>
      {current.href ? <Link href={current.href}>{body}</Link> : body}
    </div>
  );
}