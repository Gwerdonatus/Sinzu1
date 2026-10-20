import CollectionPageClient from './CollectionPageClient';

// Categories now come live from the Square catalog, so this
// route renders dynamically instead of being pre-built.
export const dynamic = 'force-dynamic';

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return <CollectionPageClient category={category} />;
}
