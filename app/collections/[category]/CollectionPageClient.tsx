'use client';
import Header from '@/components/Header';
import ChatWidget from '@/components/ChatWidget';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCard from '@/components/ProductCard';
import { useProducts, ProductGridSkeleton } from '@/hooks/useProducts';
import Link from 'next/link';

export default function CollectionPageClient({ category }: { category: string }) {
  const { products, loading, getSaleProducts, getProductsByCategory } = useProducts();

  const decoded = decodeURIComponent(category);
  let filtered = products;
  let title = 'All Products';

  if (decoded === 'sale') {
    filtered = getSaleProducts();
    title = 'Sale';
  } else if (decoded === 'best-sellers' || decoded === 'bestsellers') {
    const flagged = products.filter((p) => p.badge === 'Best Seller');
    filtered = flagged.length ? flagged : products.slice(0, 12);
    title = 'Best Sellers';
  } else if (decoded) {
    filtered = getProductsByCategory(decoded);
    title = decoded.charAt(0).toUpperCase() + decoded.slice(1).replace('-', ' ');
  }

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <div className="px-4 py-6">
        <div className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{title}</span>
        </div>
        <h1 className="font-serif text-2xl font-bold mb-2 text-center">{title}</h1>
        {!loading && (
          <p className="text-sm text-gray-500 text-center mb-6">{filtered.length} products</p>
        )}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </div>
      <ChatWidget />
    </main>
  );
}
