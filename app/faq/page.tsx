'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface QA { q: string; a: string; }

const SECTIONS: { title: string; items: QA[] }[] = [
  {
    title: 'Orders & Shipping',
    items: [
      {
        q: 'How long does shipping take?',
        a: 'Orders are typically processed within 1–3 business days. Shipping times vary depending on your location, and tracking information will be provided once your order ships.',
      },
      {
        q: 'Do you offer local pickup?',
        a: 'Yes! If you\'re in the area, you can select local pickup at our Mall of America kiosk when available.',
      },
      {
        q: 'Do you ship nationwide?',
        a: 'Yes! We ship throughout the United States. Additional shipping options may become available in the future.',
      },
    ],
  },
  {
    title: 'Products',
    items: [
      {
        q: 'Is your African Black Soap authentic?',
        a: 'Yes. We carefully source authentic African Black Soap known for its natural cleansing and skincare benefits.',
      },
      {
        q: 'Is your Shea Butter 100% natural?',
        a: 'Yes. Our shea butter is pure, unrefined, and rich in vitamins that help moisturize and nourish the skin.',
      },
      {
        q: 'Can African Black Soap help with acne?',
        a: 'Many customers use African Black Soap as part of their skincare routine for acne-prone skin. Results vary from person to person, and we recommend following up with a moisturizer after use.',
      },
      {
        q: 'Are your bonnets and durags satin?',
        a: 'Yes! Our bonnets and durags are made with premium satin to help reduce friction, retain moisture, and protect your hair.',
      },
      {
        q: 'Will your jewelry tarnish?',
        a: 'With proper care, your jewelry is designed to maintain its beauty. To extend its lifespan, avoid water, perfumes, lotions, and harsh chemicals, and store it in a dry place when not in use.',
      },
    ],
  },
  {
    title: 'Returns',
    items: [
      {
        q: 'Do you accept returns?',
        a: 'Due to hygiene and quality standards, haircare and skincare products are generally non-returnable. Jewelry may be eligible for return if it is unworn and returned within the stated return period. Please see our Return Policy for full details.',
      },
      {
        q: 'What if I receive a damaged item?',
        a: 'Contact us within 48 hours of receiving your order with photos of the item, and we\'ll work quickly to make it right.',
      },
    ],
  },
  {
    title: 'Shopping',
    items: [
      {
        q: 'How do I know when new products are available?',
        a: 'Follow us on social media or subscribe to our email list to receive updates on new arrivals, restocks, and exclusive offers.',
      },
      {
        q: 'Can I purchase products at your kiosk?',
        a: 'Absolutely! Visit us at our Mall of America kiosk to shop in person and see our latest collections.',
      },
      {
        q: 'Do you offer gift packaging?',
        a: 'Yes! Gift packaging is available for select items.',
      },
    ],
  },
  {
    title: 'Brand',
    items: [
      {
        q: 'What is $INZU?',
        a: '$INZU is a lifestyle brand focused on helping you look good, feel confident, and care for yourself through thoughtfully curated jewelry, skincare, and haircare essentials.',
      },
      {
        q: 'Why choose $INZU?',
        a: 'We believe confidence begins with self-care. Every product is selected with quality, style, and everyday luxury in mind.',
      },
    ],
  },
];

function AccordionItem({ q, a }: QA) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e5dfd0]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between text-left group"
        aria-expanded={open}
      >
        <span className="font-playfair text-[15px] md:text-[16px] font-medium text-[#1a1200] pr-4">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[#8b6914] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="grid overflow-hidden transition-all duration-500"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 pr-10 text-[14px] leading-[1.75] text-[#5b5348]">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500&display=swap');
        .font-playfair{ font-family:'Playfair Display',serif; }
        .font-inter{ font-family:'Inter',sans-serif; }
      `}</style>

      <AnnouncementBar />
      <Header />

      <div className="max-w-3xl mx-auto px-5 py-14 md:py-20 font-inter">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#8b6914] font-medium mb-4">
            Support & Info
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-semibold text-[#1a1200] mb-4">
            Frequently Asked Questions
          </h1>
          <div className="w-12 h-[2px] mx-auto bg-gradient-to-r from-[#a8862a] via-[#e2c471] to-[#a8862a]" />
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <section key={section.title} className="mb-10">
            <h2 className="font-playfair text-2xl font-medium text-[#54400e] italic mb-4">
              {section.title}
            </h2>
            <div>
              {section.items.map((qa) => (
                <AccordionItem key={qa.q} q={qa.q} a={qa.a} />
              ))}
            </div>
          </section>
        ))}

        {/* Closing note */}
        <div className="mt-16 p-8 bg-[#faf3de] rounded-lg text-center">
          <h3 className="font-playfair text-xl italic text-[#1a1200] mb-3">
            Still have questions?
          </h3>
          <p className="text-[14px] text-[#5b5348] mb-5">
            We&apos;d love to help! Contact our team and we&apos;ll get back to you as soon as possible.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-[#1a1200] text-[#e2c471] text-[11px] font-medium tracking-[0.28em] uppercase rounded-full hover:bg-[#3d2a0e] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <ChatWidget />
    </main>
  );
}
