import type { Metadata } from 'next';
import type { ReactNode } from 'react';


export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse SINZU's full collection of luxury jewelry, premium haircare, and culturally-rooted skincare. Ships nationwide from Minnesota.",
  alternates: { canonical: "https://sinzu.shop/shop" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
