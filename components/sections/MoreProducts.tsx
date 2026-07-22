import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

export default function MoreProducts({ products }: { products: Product[] }) {
  return (
    <section className="px-4 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}