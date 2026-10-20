import ProductPageClient from './ProductPageClient';

// Product pages render dynamically — products live in the Square catalog.
export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductPageClient id={id} />;
}
