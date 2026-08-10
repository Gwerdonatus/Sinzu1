# SINZU — Production Launch Guide

You're deploying to real customers with real money. Follow this in order — takes ~30 minutes total.

---

## ⚠️ First: Rotate your Resend API key

Your previous Resend key was shared with third parties (assistant + zip file). Even if the risk is low, best practice is to rotate it before launch:

1. Go to https://resend.com/api-keys
2. Delete the old key
3. Create a new one → copy it
4. You'll paste it into Vercel in Step 3 below

---

## Step 1 — Get your Square Production keys

1. Go to https://developer.squareup.com/apps
2. Open your SINZU app
3. In the top-left tab dropdown, switch from **Sandbox** to **Production**
4. Copy three values from the Credentials page:
   - **Access Token** (starts with `EAAA...`)
   - **Application ID** (starts with `sq0idp-...`)
5. Get your Production **Location ID**:
   - Go to https://squareup.com/dashboard/locations
   - Click your location → copy the Location ID at the top (e.g., `L...`)

Keep these five values in a notes app for the next step:
- Access Token
- Application ID
- Location ID
- (Environment is always `production`)

---

## Step 2 — Add real products to Square

Sandbox test products won't come with you to production. In your production Square Dashboard:

1. https://squareup.com/dashboard/items/library
2. **Delete any sandbox-carried items** if any snuck through
3. **Add each real product**:
   - Name, description, category (`Jewelry`, `Haircare`, or `Skincare` — case-insensitive)
   - Add variations if the item has sizes/options (each variation = one SKU with its own price and stock)
   - Upload photos (first photo is the primary card image)
   - Set inventory quantity per variation

**Badge tags** (put at start of description, they get stripped from display):
- `[NEW]` → gold "New" badge
- `[BESTSELLER]` → "Best Seller" badge (also feeds homepage Best Sellers)
- `[SALE:4200]` → shows original $42.00 crossed out (value in cents)

Multiple tags allowed: `[BESTSELLER][SALE:6500] Hand-crafted…`

**How long until a new product appears on the site:** about 15 seconds. The site caches the
Square catalog briefly so it is not hitting the API on every page view. To see a change
immediately, load `/api/products?fresh=1` once, then refresh the site.

**A product must meet all of these to appear on the site.** `/api/square/health` tells you
which one an item is failing:
- Not archived in Square
- Online site visibility not set to Private/Unavailable
- Enabled for your store location
- At least one variation with a **fixed price** — Square's "Variable" pricing has no amount
  to display or charge, so those items can't be listed online
- A category set, otherwise it only appears under **Shop All** (the nav links to Jewelry,
  Haircare, Skincare, Best Sellers and Sale — a product in any other category is still
  reachable from Shop All and by direct link, just not from the top nav)

---

## Step 3 — Set Vercel environment variables

1. Go to Vercel Dashboard → your Sinzu1 project → **Settings** → **Environment Variables**
2. **Delete all existing sandbox variables** (Square + Resend if present)
3. Add these ten variables. For each, click "Add New", paste values, tick **Production + Preview + Development**, Save:

| Name | Value |
|---|---|
| `SQUARE_ACCESS_TOKEN` | (production access token from Step 1) |
| `SQUARE_ENVIRONMENT` | `production` |
| `NEXT_PUBLIC_SQUARE_APPLICATION_ID` | (production app ID from Step 1) |
| `NEXT_PUBLIC_SQUARE_LOCATION_ID` | (production location ID from Step 1) |
| `NEXT_PUBLIC_SQUARE_ENVIRONMENT` | `production` |
| `RESEND_API_KEY` | (your new Resend key from top of this doc) |
| `MAIL_FROM` | `SINZU <hello@sinzu.shop>` |
| `MAIL_REPLY_TO` | `hello@sinzu.shop` |
| `OWNER_EMAIL` | `hello@sinzu.shop` |
| `NEXT_PUBLIC_SITE_URL` | `https://sinzu.shop` |

---

## Step 4 — Push code and deploy

```bash
cd path/to/sinzu-website-v3
git add .
git commit -m "Production launch"
git push origin main
```

Vercel auto-deploys in ~2 minutes. Watch the deploy at Vercel Dashboard → Deployments.

If the build fails, click the failed deployment → **Build Logs** → paste the red error line and I'll fix it.

---

## Step 5 — Point sinzu.shop to Vercel

If not already done:

1. Vercel → Settings → **Domains** → Add `sinzu.shop` and `www.sinzu.shop`
2. Vercel shows you DNS records (A record + CNAME)
3. Add them in Cloudflare (Cloudflare Dashboard → sinzu.shop → **DNS → Records** → Add each)
4. For the A record, turn the proxy status to **DNS only** (grey cloud) or leave proxied — either works
5. Wait 5–10 minutes for DNS propagation

Once done, https://sinzu.shop should load your live site.

---

## Step 6 — Verify Resend is sending

1. Go to https://resend.com/domains → confirm `sinzu.shop` shows ✅ Verified
2. If not verified, add the DNS records Resend shows into Cloudflare (SPF + DKIM + DMARC). Make sure they're **DNS only** (grey cloud), not proxied.
3. Once verified, your emails will send from `hello@sinzu.shop`

---

## Step 7 — End-to-end test with a real card

Once deployed, do one live test:

1. Open https://sinzu.shop in an incognito window
2. Sign up for the newsletter at the footer → check your inbox for the WELCOME10 email
3. Add an item to cart → checkout with a **real credit card** for a **small amount** (a $1 test item works)
4. Verify:
   - [ ] Order confirmation email lands in your inbox (customer copy)
   - [ ] New order notification email lands in your inbox (owner copy — same address if `OWNER_EMAIL=hello@sinzu.shop`)
   - [ ] Order appears in https://squareup.com/dashboard/orders with shipping address
   - [ ] Money appears in your Square balance (production, not sandbox)
5. Refund the test in Square Dashboard immediately if you want your dollar back

---

## Managing reviews (ongoing)

Reviews come in two ways — both go to your inbox:

- **In-site form**: customer clicks "Review" on a product page → submits → you get an email
- **Email**: customer clicks "or email us instead" → emails `reviews@sinzu.shop` → you get it via Cloudflare forwarding

To publish a review:
1. Open the moderation email — it contains a pre-formatted JSON block (or copy from the customer's plain-text email)
2. Open `data/reviews.json` locally
3. Paste the JSON object into the `"reviews": []` array
4. Set `"verified": true` if you can confirm they bought
5. Commit + push:
   ```bash
   git add data/reviews.json
   git commit -m "Add review"
   git push
   ```
6. Vercel redeploys in 90 seconds and the review appears

To delete a review: remove its JSON object from the array, commit + push.

**Scope keys** control where a review shows:
- `"productId": "<square-item-id>"` — that product only
- `"productId": "*"` — every product page
- `"productId": "jewelry:*"` — all jewelry products
- `"productId": "haircare:*"` — all haircare
- `"productId": "skincare:*"` — all skincare

---

## Discount codes

Edit `lib/discounts.ts` to add/remove codes. Currently active:

- `MOA15` — 15% off (Mall of America business card promo)
- `WELCOME10` — 10% off first order (email signup incentive)

Discounts appear as line items on Square orders → trackable in Square reports.

---

## Fulfilling orders (day-to-day)

- **Pickup orders**: Square Dashboard → Orders → filter to "Pickup" → mark "Prepared" → customer gets Square's built-in pickup-ready email automatically
- **Shipping orders**: Square Dashboard → Orders → filter to "Shipment" → print packing slip → add tracking number when you ship → mark "Completed" → customer gets Square's tracking email automatically

You can integrate **Shippo** or **ShipStation** with Square later for cheaper postage — they pull Square orders in automatically, no code changes.

---

## If something breaks after launch

Send me a screenshot of:
- The error the customer sees, OR
- The Vercel build log red text, OR
- The Square Dashboard order that looks wrong

**First stop for anything Square-related:** open `/api/square/health` on the site
(e.g. https://sinzu.shop/api/square/health). It checks the credentials, the location,
the catalog read, and lists any product in Square that is *not* showing on the site
along with the reason why. It never exposes your access token.

Common quick fixes:
- **Products don't load / "Failed to load products from Square"** → open `/api/square/health`.
  A 401 there means `SQUARE_ACCESS_TOKEN` is from the wrong environment (a sandbox token
  cannot read the production catalog) or has been revoked. All four Square values must come
  from the same environment.
- **A product is in Square but not on the site** → `/api/square/health` lists it under
  `hiddenItems` with the reason (archived, hidden from the online site, not enabled for your
  location, or priced as "Variable" instead of a fixed amount).
- **"Missing SQUARE_ACCESS_TOKEN"** → env var didn't save in Vercel; re-add and redeploy
- **Emails not sending** → Resend domain not verified, or key expired; check https://resend.com/domains
- **Payment says "declined"** on a good card → sandbox key still in production env; verify all env vars say `production`
- **404s on collection pages** → item category name in Square doesn't match `jewelry`/`haircare`/`skincare` (matcher is fuzzy, but check it)

---

Good luck. 🎉
