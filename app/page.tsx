'use client';

import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import ChatWidget from '@/components/ChatWidget';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import CategoryBanners from '@/components/sections/CategoryBanners';
import TrustBar from '@/components/sections/TrustBar';
import MOASection from '@/components/sections/MOASection';
import EmailSignup from '@/components/sections/EmailSignup';
import SinzuBodyBanner from '@/components/sections/SinzuBodyBanner';
import ConnectSection from '@/components/sections/ConnectSection';
import ShowLooksSection from '@/components/sections/ShowLooksSection';
import VideoSection from '@/components/sections/VideoSection';
import { useProducts } from '@/hooks/useProducts';

export default function Home() {
  const { products } = useProducts();
  const featured = products.slice(0, 6);

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />

      <HeroSection />
      <FeaturedProducts products={featured} />

      {/* 3 editorial category panels — Jewelry / Skin Care / Hair Care */}
      <CategoryBanners />


      <TrustBar />


      {/* Elevated MOA milestone announcement */}
      <MOASection />

      <SinzuBodyBanner />

      <ConnectSection />

      <ShowLooksSection />

      <VideoSection />

      <EmailSignup />

      <ChatWidget />
    </main>
  );
}
