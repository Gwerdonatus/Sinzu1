import ProductPageClient from './ProductPageClient';

// Product pages render dynamically — products live in the Square catalog.
export const dynamic = 'force-dynamic';

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductPageClient id={params.id} />;
}
