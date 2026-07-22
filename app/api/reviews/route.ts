import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { fetchProducts } from '@/lib/catalog';
import { sendEmail, OWNER_EMAIL } from '@/lib/email/send';
import { reviewSubmissionEmail } from '@/lib/email/templates';

export const dynamic = 'force-dynamic';

// ============================================================
// Reviews
//
// STORAGE: data/reviews.json (committed to the repo).
// - Reviews with `productId: "some-square-item-id"` show on that
//   product's page only.
// - Reviews with `productId: "*"` show on every product page (great
//   for general brand testimonials).
// - Reviews with `productId: "jewelry:*"`, `"haircare:*"`,
//   `"skincare:*"` show on all products in that category.
//
// FLOW: Customers submit via the product page → the review is
// emailed to the owner formatted for copy-paste → owner adds
// it to data/reviews.json and redeploys.
//
// This gives you moderation (no spam), works for free on Vercel,
// and can be swapped for a database later without changing the
// component that reads it.
// ============================================================

interface Review {
  productId: string;
  reviewerName: string;
  rating: number;
  title?: string;
  content: string;
  date: string;
  verified?: boolean;
}

async function loadReviews(): Promise<Review[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'reviews.json');
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.reviews) ? parsed.reviews : [];
  } catch {
    return [];
  }
}

/** Filter reviews relevant to a product ID + its category. */
function reviewsForProduct(all: Review[], productId: string, categoryNormalized?: string): Review[] {
  return all
    .filter((r) => {
      if (r.productId === productId) return true;
      if (r.productId === '*') return true;
      if (categoryNormalized) {
        const catPrefix = categoryNormalized + ':*';
        if (r.productId === catPrefix) return true;
      }
      return false;
    })
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId');
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

  const [allReviews, catalog] = await Promise.all([loadReviews(), fetchProducts()]);
  const product = catalog.find((p) => p.id === productId);
  const norm = product?.category.toLowerCase().replace(/[^a-z]/g, '');

  const list = reviewsForProduct(allReviews, productId, norm);

  const avg =
    list.length > 0
      ? Math.round((list.reduce((s, r) => s + r.rating, 0) / list.length) * 10) / 10
      : null;

  return NextResponse.json({
    productId,
    count: list.length,
    average: avg,
    reviews: list,
  });
}

// POST — customer submits a review; emails owner for moderation.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, reviewerName, reviewerEmail, rating, title, content } = body;

    if (!productId || !reviewerName?.trim() || !reviewerEmail?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(reviewerEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }
    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      return NextResponse.json({ error: 'Please select a rating from 1 to 5' }, { status: 400 });
    }
    if (content.length > 1500 || (title && title.length > 120) || reviewerName.length > 60) {
      return NextResponse.json({ error: 'Review is too long' }, { status: 400 });
    }

    const catalog = await fetchProducts();
    const product = catalog.find((p) => p.id === productId);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const email = reviewSubmissionEmail({
      productName: product.name,
      productId,
      reviewerName: reviewerName.trim(),
      reviewerEmail: reviewerEmail.trim(),
      rating: r,
      title: title?.trim() || undefined,
      content: content.trim(),
    });

    await sendEmail({ to: OWNER_EMAIL, ...email, replyTo: reviewerEmail });

    return NextResponse.json({ ok: true, moderated: true });
  } catch (e: any) {
    console.error('[review-submit]', e);
    return NextResponse.json({ error: 'Could not submit review. Please try again.' }, { status: 500 });
  }
}
