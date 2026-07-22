import CollectionPageClient from './CollectionPageClient';

// Categories now come live from the Square catalog, so this
// route renders dynamically instead of being pre-built.
export const dynamic = 'force-dynamic';

export default function CollectionPage({
  params,
}: {
  params: { category: string };
}) {
  return <CollectionPageClient category={params.category} />;
}
