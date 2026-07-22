import type { Metadata } from 'next';
import type { ReactNode } from 'react';


export const metadata: Metadata = {
  title: "Visit Our Stores",
  description: "Visit SINZU at Northtown Mall in Blaine, MN. Coming soon to Mall of America — Opening August 10, 2026.",
  alternates: { canonical: "https://sinzu.shop/visit" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
