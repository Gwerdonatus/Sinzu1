import type { Metadata } from 'next';
import type { ReactNode } from 'react';


export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with SINZU. Call +1 (612) 487-8228 or email hello@sinzu.shop.",
  alternates: { canonical: "https://sinzu.shop/contact" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
