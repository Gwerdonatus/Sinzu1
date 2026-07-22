'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, Check, AlertCircle, Loader2, ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface Review {
  productId: string;
  reviewerName: string;
  rating: number;
  title?: string;
  content: string;
  date: string;
  verified?: boolean;
}

interface ReviewsResponse {
  productId: string;
  count: number;
  average: number | null;
  reviews: Review[];
}

interface Props {
  productId: string;
  productName: string;
}

/* ── Deterministic avatar: soft gradient disc with initials ── */
const AVATAR_PALETTE = [
  { from: '#e8ddd5', to: '#d4c4b0', text: '#5a4a3a' },
  { from: '#d5e0d8', to: '#b8c9be', text: '#3a4a40' },
  { from: '#ddd5e0', to: '#c4b8c9', text: '#4a3a50' },
  { from: '#d5dce8', to: '#b8c4d4', text: '#3a4050' },
  { from: '#e8d5d5', to: '#d4b8b8', text: '#5a3a3a' },
  { from: '#d8e0d5', to: '#bfc9b8', text: '#3f4a38' },
  { from: '#e0d8d0', to: '#c9bfb4', text: '#4a4038' },
  { from: '#d0d8e0', to: '#b4bec9', text: '#38404a' },
];

function getAvatarStyle(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

/* ── Gold star display ── */
function StarDisplay({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-[2px]" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = rating >= n;
        const partial = !filled && rating > n - 1;
        return (
          <span key={n} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="text-black/8" fill="currentColor" strokeWidth={0} />
            {(filled || partial) && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: filled ? '100%' : `${(rating - (n - 1)) * 100}%` }}>
                <Star size={size} className="text-[#c9a227]" fill="currentColor" strokeWidth={0} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

/* ── Interactive star picker ── */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? value;
  return (
    <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
          className="p-1 transition-transform hover:scale-110"
        >
          <Star
            size={24}
            className={n <= active ? 'text-[#c9a227]' : 'text-black/8'}
            fill={n <= active ? '#c9a227' : 'currentColor'}
            strokeWidth={0}
          />
        </button>
      ))}
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

/* ═══════════════════════════════════════════════════════════
   REVIEW CARD — teaser by default, expands in place on tap
   ═══════════════════════════════════════════════════════════ */
function ReviewCard({
  review,
  open,
  onToggle,
}: {
  review: Review;
  open: boolean;
  onToggle: () => void;
}) {
  const avatar = getAvatarStyle(review.reviewerName);
  const initials = getInitials(review.reviewerName);

  return (
    <div
      className={`h-full rounded-2xl border transition-all duration-400 ${
        open ? 'border-black/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]' : 'border-black/6 bg-white hover:border-black/12 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
      }`}
    >
      <button onClick={onToggle} className="w-full text-left p-5 md:p-6 flex flex-col gap-3.5" aria-expanded={open}>
        {/* Top row: avatar + name + verified */}
        <div className="flex items-center gap-3">
          <div
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold tracking-wider"
            style={{ background: `linear-gradient(135deg, ${avatar.from}, ${avatar.to})`, color: avatar.text }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13.5px] font-semibold text-black truncate">{review.reviewerName}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-[9px] text-black/40 bg-black/[0.04] px-1.5 py-[2px] rounded-full font-medium shrink-0">
                  <Check size={8} strokeWidth={3} /> Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StarDisplay rating={review.rating} size={11} />
              <span className="text-[11px] text-black/30">{formatDate(review.date)}</span>
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`shrink-0 text-black/25 transition-transform duration-400 mt-1 ${open ? 'rotate-180' : ''}`}
          />
        </div>

        {/* Title — always visible, acts as the teaser */}
        {review.title && (
          <h3 className="font-serif text-[16px] italic text-black leading-snug">
            &ldquo;{review.title}&rdquo;
          </h3>
        )}

        {/* Collapsed preview line of the content */}
        {!open && (
          <p className="text-[13px] leading-[1.7] text-black/45 line-clamp-2">{review.content}</p>
        )}

        {/* Expanded full content */}
        <div
          className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ maxHeight: open ? '600px' : '0px', opacity: open ? 1 : 0 }}
        >
          <p className="text-[13px] leading-[1.75] text-black/60 pt-0.5">{review.content}</p>
        </div>

        {!open && (
          <span className="text-[10px] tracking-[0.15em] uppercase text-black/30 font-medium">Read review</span>
        )}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CAROUSEL — 1 card/page on mobile, 2 cards/page on desktop.
   Auto-advances, swipeable, pauses on interaction or when a
   card is open.
   ═══════════════════════════════════════════════════════════ */
function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [itemsPerView, setItemsPerView] = useState(1);
  const [page, setPage] = useState(0);
  const [openKey, setOpenKey] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setItemsPerView(mq.matches ? 2 : 1);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const pages: Review[][] = [];
  for (let i = 0; i < reviews.length; i += itemsPerView) pages.push(reviews.slice(i, i + itemsPerView));
  const pageCount = pages.length;

  // clamp page if itemsPerView changes
  useEffect(() => { if (page > pageCount - 1) setPage(Math.max(0, pageCount - 1)); }, [pageCount, page]);

  // autoplay
  useEffect(() => {
    if (pageCount <= 1 || openKey !== null) return;
    const t = setInterval(() => setPage((p) => (p + 1) % pageCount), 5500);
    return () => clearInterval(t);
  }, [pageCount, openKey]);

  const goTo = (p: number) => setPage(((p % pageCount) + pageCount) % pageCount);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    setDragX(e.touches[0].clientX - touchStartX.current);
  };
  const onTouchEnd = () => {
    const width = trackRef.current?.offsetWidth || 1;
    const threshold = width * 0.18;
    if (dragX < -threshold) goTo(page + 1);
    else if (dragX > threshold) goTo(page - 1);
    touchStartX.current = null;
    setDragX(0);
  };

  return (
    <div>
      <div
        className="overflow-hidden -mx-1 px-1"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{
            transform: `translateX(calc(${-page * 100}% + ${dragX}px))`,
            transition: touchStartX.current !== null ? 'none' : 'transform 0.55s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {pages.map((group, pi) => (
            <div key={pi} className="w-full shrink-0 px-1">
              <div className={`grid gap-3.5 ${itemsPerView === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {group.map((review, gi) => {
                  const key = pi * itemsPerView + gi;
                  return (
                    <ReviewCard
                      key={key}
                      review={review}
                      open={openKey === key}
                      onToggle={() => setOpenKey(openKey === key ? null : key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav: arrows + dots */}
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => goTo(page - 1)}
            aria-label="Previous reviews"
            className="w-8 h-8 rounded-full flex items-center justify-center text-black/30 hover:text-black hover:bg-black/[0.04] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to review page ${i + 1}`}
                className="h-[3px] rounded-full transition-all duration-400"
                style={{
                  width: i === page ? 20 : 6,
                  background: i === page ? '#000' : 'rgba(0,0,0,0.12)',
                }}
              />
            ))}
          </div>
          <button
            onClick={() => goTo(page + 1)}
            aria-label="Next reviews"
            className="w-8 h-8 rounded-full flex items-center justify-center text-black/30 hover:text-black hover:bg-black/[0.04] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function ProductReviews({ productId, productName }: Props) {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (alive) setData(d); })
      .catch(() => alive && setData({ productId, count: 0, average: null, reviews: [] }))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [productId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) { setSubmitError('Please select a rating'); return; }
    setSubmitting(true); setSubmitError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, reviewerName: name, reviewerEmail: email, rating, title, content }),
      });
      const result = await res.json();
      if (!res.ok) { setSubmitStatus('error'); setSubmitError(result.error || 'Please try again'); return; }
      setSubmitStatus('success');
      setRating(0); setName(''); setEmail(''); setTitle(''); setContent('');
    } catch {
      setSubmitStatus('error'); setSubmitError('Network error. Please try again.');
    } finally { setSubmitting(false); }
  };

  if (loading || !data) {
    return (
      <section className="border-t border-black/5 px-5 py-14 max-w-[760px] mx-auto">
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-4 h-4 animate-spin text-black/10" />
        </div>
      </section>
    );
  }

  const hasReviews = data.reviews.length > 0;

  return (
    <section className="border-t border-black/5 px-5 py-14 max-w-[760px] mx-auto" id="reviews">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600&display=swap');

        :root { --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1); }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-up { animation: fadeInUp 0.6s var(--ease-out-expo) forwards; opacity: 0; }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .rv-input {
          width: 100%;
          padding: 12px 14px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 10px;
          font-size: 14px;
          color: #000;
          font-family: 'Inter', 'Helvetica Neue', sans-serif;
          transition: border-color 0.3s var(--ease-out-expo), box-shadow 0.3s ease;
        }
        .rv-input:focus { outline: none; border-color: rgba(0,0,0,0.2); box-shadow: 0 0 0 3px rgba(0,0,0,0.03); }
        .rv-input::placeholder { color: rgba(0,0,0,0.3); }
        .rv-label {
          display: block;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.4);
          font-weight: 500;
          margin-bottom: 8px;
          font-family: 'Inter', 'Helvetica Neue', sans-serif;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-up { animation: none; opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-8 anim-up">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-black/40 font-medium mb-2 font-inter">
            Customer Reviews
          </p>
          <h2 className="text-[22px] md:text-[26px] font-semibold text-black tracking-tight font-serif italic leading-[1.1]">
            What people are saying
          </h2>

          {data.average !== null ? (
            <div className="mt-2.5 flex items-center gap-2.5">
              <StarDisplay rating={data.average} size={14} />
              <span className="text-[14px] font-semibold text-black">{data.average.toFixed(1)}</span>
              <span className="w-px h-3 bg-black/10" />
              <span className="text-[12px] text-black/40">
                {data.count} review{data.count === 1 ? '' : 's'}
              </span>
            </div>
          ) : (
            <p className="mt-2.5 text-[13px] text-black/40">Be the first to review.</p>
          )}
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="shrink-0 inline-flex items-center gap-1.5 bg-black text-white px-4 py-2.5 text-[10px] font-medium tracking-[0.12em] uppercase rounded-full hover:bg-black/80 transition-all duration-300 hover:-translate-y-0.5"
        >
          {showForm ? 'Close' : (<><Plus size={12} strokeWidth={2.5} />Review</>)}
        </button>
      </div>

      {/* Write a review form */}
      {showForm && (
        <div className="mb-8 p-5 md:p-6 bg-black/[0.02] rounded-2xl border border-black/6 anim-up">
          {submitStatus === 'success' ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="font-serif text-lg italic text-black mb-1">Thank you!</h3>
              <p className="text-[13px] text-black/60 mb-4 max-w-sm mx-auto leading-relaxed">
                Your review is submitted and will appear once approved.
              </p>
              <button
                onClick={() => { setSubmitStatus('idle'); setShowForm(false); }}
                className="text-[11px] tracking-[0.2em] uppercase text-black/40 font-medium underline hover:text-black transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-serif text-base italic text-black">Review {productName}</h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-[11px] tracking-[0.2em] uppercase text-black/30 hover:text-black transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="rv-label">Rating *</label>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="rv-label" htmlFor="rv-name">Name *</label>
                  <input id="rv-name" className="rv-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required maxLength={60} />
                </div>
                <div>
                  <label className="rv-label" htmlFor="rv-email">Email *</label>
                  <input id="rv-email" className="rv-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
              </div>

              <div>
                <label className="rv-label" htmlFor="rv-title">Title <span className="normal-case tracking-normal text-black/30">(optional)</span></label>
                <input id="rv-title" className="rv-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summarize your experience" maxLength={120} />
              </div>

              <div>
                <label className="rv-label" htmlFor="rv-content">Your review *</label>
                <textarea id="rv-content" className="rv-input" value={content} onChange={(e) => setContent(e.target.value)} placeholder="What did you love? What surprised you?" required rows={3} maxLength={1500} />
                <p className="text-[10px] text-black/30 mt-1.5 text-right">{content.length}/1500</p>
              </div>

              {submitError && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle size={14} /> {submitError}
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[10px] font-medium tracking-[0.12em] uppercase rounded-full hover:bg-black/80 transition-all duration-300 disabled:opacity-40"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {submitting ? 'Submitting' : 'Submit'}
                </button>
                <p className="text-[10px] text-black/30">Moderated before publishing.</p>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Carousel */}
      {!hasReviews ? (
        <div className="text-center py-12 border-t border-black/5 anim-up">
          <p className="text-[14px] text-black/40 italic font-serif">No reviews yet. Be the first.</p>
        </div>
      ) : (
        <div className="anim-up">
          <ReviewCarousel reviews={data.reviews} />
        </div>
      )}
    </section>
  );
}