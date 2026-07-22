'use client';

import { ReactNode } from 'react';
import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import ChatWidget from '@/components/ChatWidget';

interface Props {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export default function PolicyLayout({ eyebrow, title, lastUpdated, children }: Props) {
  return (
    <main className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500&display=swap');
        .font-playfair{ font-family:'Playfair Display',serif; }
        .font-inter{ font-family:'Inter',sans-serif; }
        .policy-body h2{
          font-family:'Playfair Display',serif;
          font-size:1.35rem; font-weight:500; font-style:italic;
          color:#54400e; margin:2.4rem 0 .8rem;
        }
        .policy-body h3{
          font-family:'Playfair Display',serif;
          font-size:1.1rem; font-weight:500;
          color:#1a1200; margin:1.6rem 0 .5rem;
        }
        .policy-body p{
          font-size:14px; line-height:1.75;
          color:#5b5348; margin-bottom:1rem;
        }
        .policy-body ul{
          list-style:disc; padding-left:1.4rem; margin-bottom:1.1rem;
        }
        .policy-body ul li{
          font-size:14px; line-height:1.75; color:#5b5348; margin-bottom:.4rem;
        }
        .policy-body a{
          color:#8b6914; text-decoration:underline;
        }
        .policy-body a:hover{ color:#54400e; }
        .policy-body strong{ color:#1a1200; font-weight:500; }
      `}</style>

      <AnnouncementBar />
      <Header />

      <div className="max-w-3xl mx-auto px-5 py-14 md:py-20 font-inter">
        <div className="text-center mb-10">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#8b6914] font-medium mb-4">
            {eyebrow}
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-semibold text-[#1a1200] mb-4">
            {title}
          </h1>
          <div className="w-12 h-[2px] mx-auto bg-gradient-to-r from-[#a8862a] via-[#e2c471] to-[#a8862a] mb-4" />
          <p className="text-xs text-[#8b6914] tracking-wider">Last updated: {lastUpdated}</p>
        </div>

        <div className="policy-body">{children}</div>
      </div>

      <ChatWidget />
    </main>
  );
}
