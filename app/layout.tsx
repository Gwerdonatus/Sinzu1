import type { Metadata, Viewport } from 'next'
import { CartProvider } from '@/hooks/useCart'
import { ProductsProvider } from '@/hooks/useProducts'
import Footer from '@/components/sections/Footer'
import './globals.css'

const SITE = 'https://sinzu.shop';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'SINZU LLC — Everyday Luxury. Made to Stand Out.',
    template: '%s · SINZU LLC',
  },
  description:
    'Culturally-rooted jewelry, premium haircare, and skincare essentials from SINZU. Shop online, visit Northtown Mall, and stop by our new Mall of America location opening August 10, 2026.',
  applicationName: 'SINZU',
  authors: [{ name: 'SINZU LLC' }],
  keywords: [
    'SINZU', 'sinzu', 'jewelry', 'haircare', 'skincare',
    'satin bonnet', 'silk durag', 'African black soap', 'shea butter',
    'waist beads', 'gold hoops', 'Northtown Mall', 'Mall of America',
    'Minnesota beauty', 'Black-owned beauty', 'luxury retail',
  ],
  creator: 'SINZU LLC',
  publisher: 'SINZU LLC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicons/icon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicons/icon-16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicons/icon-192.png', sizes: '192x192' },
      { rel: 'icon', url: '/favicons/icon-512.png', sizes: '512x512' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE,
    siteName: 'SINZU LLC',
    title: 'SINZU LLC — Everyday Luxury. Made to Stand Out.',
    description:
      'Culturally-rooted jewelry, premium haircare, and skincare essentials. Shop online or visit us at Northtown Mall + Mall of America (Aug 10, 2026).',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SINZU LLC — Everyday Luxury',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SINZU LLC — Everyday Luxury. Made to Stand Out.',
    description:
      'Culturally-rooted jewelry, premium haircare, and skincare essentials. Now expanding to Mall of America.',
    images: ['/og-image.png'],
    creator: '@sinzu.llc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'shopping',
  alternates: {
    canonical: SITE,
  },
}

export const viewport: Viewport = {
  themeColor: '#c9a227',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// JSON-LD structured data — helps Google understand the store
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'SINZU LLC',
  alternateName: '$INZU',
  url: SITE,
  logo: `${SITE}/sinzu-logo.png`,
  image: `${SITE}/og-image.png`,
  description:
    'Luxury jewelry, haircare, and skincare. Retail stores at Northtown Mall and Mall of America (opening Aug 10, 2026).',
  telephone: '+1-612-487-8228',
  email: 'hello@sinzu.shop',
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: '398 Northtown Dr NE',
      addressLocality: 'Blaine',
      addressRegion: 'MN',
      postalCode: '55434',
      addressCountry: 'US',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: '60 E Broadway',
      addressLocality: 'Bloomington',
      addressRegion: 'MN',
      postalCode: '55425',
      addressCountry: 'US',
    },
  ],
  sameAs: [
    'https://instagram.com/sinzu.llc',
    'https://facebook.com',
  ],
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE}/shop?q={query}`,
    'query-input': 'required name=query',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <ProductsProvider>
          <CartProvider>
            {children}
            <Footer />
          </CartProvider>
        </ProductsProvider>
      </body>
    </html>
  )
}
