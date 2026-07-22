import type { Metadata } from 'next';
import type { ReactNode } from 'react';


export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about shipping, returns, product care, jewelry, bonnets, African black soap, shea butter, and more.",
  alternates: { canonical: "https://sinzu.shop/faq" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
