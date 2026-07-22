import type { Metadata } from 'next';
import type { ReactNode } from 'react';


export const metadata: Metadata = {
  title: "About Us",
  description: "SINZU is a Minnesota retail brand celebrating five years at Northtown Mall and expanding to Mall of America. Culturally-rooted luxury jewelry, haircare, and skincare.",
  alternates: { canonical: "https://sinzu.shop/about" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
