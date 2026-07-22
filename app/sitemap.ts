import { MetadataRoute } from 'next';

const BASE = 'https://sinzu.shop';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    '', 'shop', 'about', 'contact', 'faq', 'visit',
    'terms', 'refund', 'shipping-info',
    'collections/jewelry', 'collections/haircare',
    'collections/skincare', 'collections/best-sellers', 'collections/sale',
  ];

  return staticRoutes.map((route) => ({
    url: `${BASE}/${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('collections') || route === 'shop' ? 0.9 : 0.7,
  }));
}
