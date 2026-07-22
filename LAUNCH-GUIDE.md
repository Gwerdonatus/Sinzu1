# SINZU × Square — Launch Guide

Everything's built. This is your full checklist to go live.

---

## What's now in the build

### Pages
- **Home** — announcement bar, hero, category panels, trust bar, featured, best sellers, MOA milestone section (with live countdown), body banner, connect, show looks, video, email signup
- **Shop** — live Square catalog with category tabs (Jewelry / Haircare / Skincare / Sale), URL-aware search
- **Product pages** — variation-driven pricing/stock, gallery, category-specific detail accordions, ratings summary, related products, **customer reviews**, recently viewed
- **Collections** — dynamic category pages (`/collections/jewelry`, `/haircare`, `/skincare`, `/best-sellers`, `/sale`)
- **About** — 5-year story + Northtown → MOA expansion
- **FAQ** — client's exact copy in accordion format
- **Visit Us** — Northtown Mall + Mall of America with Google Maps embeds
- **Contact / Terms / Refund / Shipping Info** — policy pages
- **Cart / Checkout** — full Square payment flow with discount code

### Payments & Checkout
- Square Web Payments SDK (card + Apple Pay ready)
- Server-side re-pricing from live catalog (no client tampering possible)
- **Discount codes**: `MOA15` (15% off), `WELCOME10` (10% off first order) — server-validated
- Shipping fulfillment attached to Square order (address flows to Dashboard → Orders)

### Emails (Resend — see setup below)
- **Order confirmation** to customer (branded, with logo)
- **New order notification** to owner (`OWNER_EMAIL`)
- **Welcome email** with WELCOME10 code on newsletter signup
- **Review submission** notification to owner for moderation

### Reviews System
- Customer reviews on product pages (star ratings, verified buyer badge, dates)
- "Write a Review" form → moderated via email → owner adds to `data/reviews.json`
- 7 seed reviews already in place (brand + category-level)

### SEO & Social Sharing
- Favicon set (16/32/48/96/180/192/512 + `.ico`)
- Apple touch icon
- `og-image.png` (1200×630) for social sharing with logo + tagline
- Web manifest for install-to-home-screen
- `robots.txt` + dynamic `sitemap.xml`
- JSON-LD structured data (Store schema with both locations)
- Per-page titles, meta descriptions, canonical URLs
- Open Graph + Twitter Card tags on every page

---

## Step 1 — Test locally in sandbox

```bash
npm install         # first time only
npm run seed        # populates sandbox with 22 test products
npm run dev         # http://localhost:3000
```

### Test cards (sandbox)

| Card | Number | Result |
|---|---|---|
| Visa | `4111 1111 1111 1111` | Approved |
| Mastercard | `5105 1051 0510 5100` | Approved |
| Declined | `4000 0000 0000 0002` | Declined |

Any future expiry, any CVV, any ZIP.

### Testing checklist

- [ ] Announcement bar cycles through 3 messages (MOA / free shipping / MOA15)
- [ ] Homepage sections all render in order
- [ ] Category panels link to `/collections/jewelry`, `/skincare`, `/haircare`
- [ ] MOA countdown updates in real-time
- [ ] Shop page filter tabs work
- [ ] Search from header → `/shop?q=`
- [ ] Product page shows category-specific accordions
- [ ] Reviews display (seed reviews should appear)
- [ ] Submit a review — check console for the log (email will send once RESEND_API_KEY is set)
- [ ] Add to cart → apply MOA15 → total drops 15% → pay with test card
- [ ] Order confirmation email logs to console (until Resend is configured)
- [ ] Order appears in Sandbox Dashboard → Orders with discount + shipping address
- [ ] Recently viewed shows after visiting 2+ products
- [ ] Favicons show in browser tab
- [ ] Share the URL in a messaging app — should show OG preview with logo

---

## Step 2 — Set up Resend for emails

1. Sign up at [resend.com](https://resend.com) (free tier: 3,000 emails/month)
2. Add domain `sinzu.shop` in Resend Dashboard
3. Add the DNS records Resend gives you (SPF + DKIM + verification) — same DNS panel as your domain registrar / Cloudflare
4. Once verified, click "API Keys" → "Create API Key" → copy it

Add to `.env.local` (and Vercel env vars):

```bash
RESEND_API_KEY=re_YOUR_KEY_HERE
MAIL_FROM="SINZU <hello@sinzu.shop>"
MAIL_REPLY_TO=hello@sinzu.shop
OWNER_EMAIL=hello@sinzu.shop
```

That's it. Order confirmations, welcome emails, and review submissions will start flowing.

**Set up hello@sinzu.shop** — use Cloudflare Email Routing (free) to forward `hello@sinzu.shop` to your personal Gmail so customer replies reach you. Instructions: cloudflare.com/products/email-routing.

---

## Step 3 — Switch to Square Production

1. [developer.squareup.com](https://developer.squareup.com/apps) → your app → **Production** tab
2. Copy: Access Token, Application ID, Location ID
3. Update these in **Vercel** → Settings → Environment Variables:

```bash
SQUARE_ACCESS_TOKEN=<production token>
SQUARE_ENVIRONMENT=production
NEXT_PUBLIC_SQUARE_APPLICATION_ID=<production app id>
NEXT_PUBLIC_SQUARE_LOCATION_ID=<production location id>
NEXT_PUBLIC_SQUARE_ENVIRONMENT=production
NEXT_PUBLIC_SITE_URL=https://sinzu.shop
```

4. Redeploy.

**Do NOT** run `npm run seed` against production. Add real products in the production Square Dashboard.

---

## Step 4 — Add real products in Square Dashboard

For each product:
1. Square Dashboard → Items & Services → Create Item
2. Set Name, Description, Category (`Jewelry`, `Haircare`, `Skincare` — matcher is fuzzy)
3. Add variations (sizes) with prices
4. Upload photo(s)
5. Set inventory
6. Save

### Badge tags in the description

Prefix the description with these tags (they're stripped from display):

| Tag | Effect |
|---|---|
| `[NEW]` | Gold "New" badge |
| `[BESTSELLER]` | Gradient "Best Seller" badge · appears in homepage Best Sellers |
| `[SALE:4200]` | Shows original price of $42.00 crossed out (in cents) |

Multiple tags allowed: `[BESTSELLER][SALE:4200] Rest of description...`

---

## Step 5 — Reviews moderation

Customer reviews land in your inbox as pre-formatted JSON.

To publish:
1. Open `data/reviews.json`
2. Paste the review JSON block (already formatted in the email) into the `reviews` array
3. Set `verified: true` if you can confirm they bought
4. Commit and redeploy

Reviews with `"productId": "*"` show on **every** product page.
Reviews with `"productId": "jewelry:*"` show on all jewelry products.
Reviews with `"productId": "<Square item ID>"` show on that specific product.

---

## Step 6 — Domain (sinzu.shop)

1. Vercel Dashboard → your project → Settings → Domains → Add `sinzu.shop` and `www.sinzu.shop`
2. Vercel gives you DNS records — add them at your registrar / Cloudflare
3. Wait ~5 min for DNS propagation

---

## Step 7 — Optional polish

- **Google Analytics 4** — send us your GA4 measurement ID and we'll wire it in
- **Real product photography** — the biggest lever for conversion
- **Category card photos** — swap `/public/collections/jewelries.png`, `/skin-care.png`, `/hair-care.png` with real campaign shots
- **Instagram / Facebook** — update the URLs in `components/sections/Footer.tsx` to real profiles

---

## Discount codes

Managed in `lib/discounts.ts`:

| Code | Discount |
|---|---|
| `MOA15` | 15% off (Mall of America business cards) |
| `WELCOME10` | 10% off first order (email signup) |

To add codes: edit `lib/discounts.ts` → redeploy.

Discounts appear as line items on Square orders → trackable in your Square Dashboard reports.

---

## File tree — what's where

```
app/
  api/
    products/          Live Square catalog feed
    inventory/         Live stock levels
    square/payment/    Checkout (order + payment + emails)
    discount/validate/ Discount preview
    subscribe/         Email signup (+ welcome email)
    reviews/           Reviews GET + POST (moderated)
  faq/                 FAQ (client's copy)
  visit/               Northtown + MOA + Google Maps
  terms/refund/shipping-info/  Policy pages
  sitemap.ts           Dynamic SEO sitemap
  layout.tsx           SEO + OG + JSON-LD

components/sections/
  MOASection.tsx       Milestone with countdown
  TrustBar.tsx         Trust indicators
  BestSellers.tsx      Best sellers grid
  EmailSignup.tsx      Newsletter form
  RecentlyViewed.tsx   Per-user recently viewed
  ProductReviews.tsx   Reviews + write-a-review form
  Footer.tsx           4-col footer w/ locations, socials, payment icons

data/
  reviews.json         Reviews (moderation happens here)

lib/
  square.ts            Server-side Square client
  catalog.ts           Products + inventory + badge tag parsing
  discounts.ts         Discount codes (edit here)
  shipping.ts          Shipping methods (edit here)
  email/
    send.ts            Resend integration
    shell.ts           Branded email HTML shell
    templates.ts       Order / welcome / owner / review emails
  recentlyViewed.ts    localStorage helper

public/
  favicon.ico, apple-touch-icon.png, og-image.png
  favicons/            Multi-size favicons
  site.webmanifest, robots.txt
  sinzu-logo.png, sinzu-logo-square.png

scripts/
  seed-sandbox.js      One-command test catalog seeding
```

---

## If something breaks

- **Emails aren't sending** → Check `RESEND_API_KEY` is set in Vercel env vars. Console logs `[email:disabled]` when the key is missing.
- **Discount code says "not valid"** → Check `lib/discounts.ts` — the code has to match exactly (case-insensitive).
- **Products aren't showing** → Check Square Dashboard → item is Available for Sale + has stock + has a category assigned.
- **OG image not showing on social** → Facebook Sharing Debugger (developers.facebook.com/tools/debug/) → "Scrape Again" to bust the cache.
- **Vercel build fails on fonts** → this only happens locally with restricted network; Vercel has internet access so builds succeed there.

Send a screenshot for anything else and I'll fix it same-day.
