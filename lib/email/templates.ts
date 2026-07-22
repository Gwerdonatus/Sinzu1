import { emailShell, emailButton, goldDivider } from './shell';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://sinzu.shop';
const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export interface OrderLineItem {
  name: string;
  variation: string;
  quantity: number;
  priceCents: number;
  imageUrl?: string;
}

export interface OrderConfirmationArgs {
  orderId: string;
  customerFirstName: string;
  customerEmail: string;
  items: OrderLineItem[];
  subtotalCents: number;
  discountCents: number;
  discountCode?: string;
  shippingCents: number;
  shippingMethod: string;
  shippingKind?: 'PICKUP' | 'SHIPMENT';
  timeline?: string[];
  totalCents: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  receiptUrl?: string;
}

/** Customer-facing order confirmation. */
export function orderConfirmationEmail(args: OrderConfirmationArgs): { subject: string; html: string; text: string } {
  const subject = `Thank you for your order, ${args.customerFirstName} — SINZU #${args.orderId.slice(-8).toUpperCase()}`;
  const orderShort = args.orderId.slice(-8).toUpperCase();

  const itemsHtml = args.items.map((li) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0e5c9;font-size:14px;color:#1a1200;">
        <table role="presentation" width="100%">
          <tr>
            ${li.imageUrl ? `<td width="70" style="padding-right:14px;vertical-align:top;">
              <img src="${li.imageUrl}" alt="" width="60" height="60" style="width:60px;height:60px;object-fit:cover;border-radius:4px;display:block;">
            </td>` : ''}
            <td style="vertical-align:top;">
              <div style="font-weight:600;color:#1a1200;line-height:1.4;">${escapeHtml(li.name)}</div>
              <div style="font-size:12px;color:#8b6914;margin-top:2px;">${escapeHtml(li.variation)} · Qty ${li.quantity}</div>
            </td>
            <td align="right" style="vertical-align:top;white-space:nowrap;padding-left:12px;">
              <span style="font-weight:600;color:#1a1200;">${money(li.priceCents * li.quantity)}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const body = `
    <h1 class="h1 headline" style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:28px;font-weight:600;color:#1a1200;line-height:1.2;">
      Thank you, ${escapeHtml(args.customerFirstName)}!
    </h1>
    <p style="margin:0 0 24px 0;font-size:14px;line-height:1.7;color:#5b5348;">
      Your order is confirmed. We&rsquo;ll send tracking as soon as your package ships (typically 1&ndash;3 business days).
    </p>

    <div style="background:#faf3de;border:1px solid #e2c471;border-radius:6px;padding:16px 20px;margin-bottom:28px;">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8b6914;font-weight:600;">Order Number</div>
      <div style="font-size:20px;font-weight:600;color:#1a1200;margin-top:4px;font-family:Georgia,serif;letter-spacing:2px;">#${orderShort}</div>
    </div>

    <h2 class="headline" style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:18px;font-weight:600;color:#1a1200;font-style:italic;">Order Summary</h2>
    <table role="presentation" width="100%" style="margin-bottom:20px;">
      ${itemsHtml}
    </table>

    <table role="presentation" width="100%" style="margin-bottom:24px;">
      <tr><td style="padding:6px 0;font-size:14px;color:#5b5348;">Subtotal</td>
          <td align="right" style="padding:6px 0;font-size:14px;color:#1a1200;">${money(args.subtotalCents)}</td></tr>
      ${args.discountCents > 0 ? `
      <tr><td style="padding:6px 0;font-size:14px;color:#8b6914;font-weight:600;">Discount ${args.discountCode ? `(${args.discountCode})` : ''}</td>
          <td align="right" style="padding:6px 0;font-size:14px;color:#8b6914;font-weight:600;">&minus; ${money(args.discountCents)}</td></tr>` : ''}
      <tr><td style="padding:6px 0;font-size:14px;color:#5b5348;">Shipping (${escapeHtml(args.shippingMethod)})</td>
          <td align="right" style="padding:6px 0;font-size:14px;color:#1a1200;">${args.shippingCents === 0 ? '<span style="color:#4a8c4a;font-weight:600;">Free</span>' : money(args.shippingCents)}</td></tr>
      <tr><td style="padding:12px 0 0 0;border-top:2px solid #1a1200;font-size:16px;font-weight:700;color:#1a1200;">Total</td>
          <td align="right" style="padding:12px 0 0 0;border-top:2px solid #1a1200;font-size:16px;font-weight:700;color:#1a1200;">${money(args.totalCents)}</td></tr>
    </table>

    <h2 class="headline" style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:18px;font-weight:600;color:#1a1200;font-style:italic;">${args.shippingKind === 'PICKUP' ? 'Pickup Location' : 'Ships To'}</h2>
    ${args.shippingKind === 'PICKUP' ? `
    <div style="margin:0 0 24px 0;padding:14px 18px;background:#faf3de;border-left:3px solid #c9a227;">
      <p style="margin:0 0 4px 0;font-size:14px;font-weight:600;color:#1a1200;">SINZU at Northtown Mall</p>
      <p style="margin:0;font-size:13px;line-height:1.65;color:#5b5348;">
        398 Northtown Dr NE<br>
        Blaine, MN 55434<br>
        <span style="color:#8b6914;font-size:12px;">Mall hours: Mon&ndash;Sat 10AM&ndash;8PM &middot; Sun 11AM&ndash;6PM</span>
      </p>
    </div>` : `
    <p style="margin:0 0 24px 0;font-size:14px;line-height:1.7;color:#5b5348;">
      ${escapeHtml(args.shippingAddress.firstName)} ${escapeHtml(args.shippingAddress.lastName)}<br>
      ${escapeHtml(args.shippingAddress.addressLine1)}<br>
      ${args.shippingAddress.addressLine2 ? escapeHtml(args.shippingAddress.addressLine2) + '<br>' : ''}
      ${escapeHtml(args.shippingAddress.city)}, ${escapeHtml(args.shippingAddress.state)} ${escapeHtml(args.shippingAddress.postalCode)}<br>
      ${escapeHtml(args.shippingAddress.country)}
    </p>`}

    ${args.timeline && args.timeline.length > 0 ? `
    <h2 class="headline" style="margin:24px 0 12px 0;font-family:Georgia,serif;font-size:18px;font-weight:600;color:#1a1200;font-style:italic;">What Happens Next</h2>
    <table role="presentation" width="100%" style="margin-bottom:20px;">
      ${args.timeline.map((step, i) => `
      <tr>
        <td width="34" valign="top" style="padding:8px 0;">
          <div style="width:24px;height:24px;border-radius:50%;background:${i === 0 ? '#1a1200' : '#f0e5c9'};color:${i === 0 ? '#e2c471' : '#8b6914'};font-size:12px;font-weight:700;text-align:center;line-height:24px;">
            ${i === 0 ? '&#10003;' : i + 1}
          </div>
        </td>
        <td valign="top" style="padding:10px 0;">
          <div style="font-size:14px;line-height:1.55;color:${i === 0 ? '#1a1200' : '#5b5348'};font-weight:${i === 0 ? '600' : '400'};">
            ${escapeHtml(step)}
          </div>
          ${i === 0 ? '<div style="font-size:11px;color:#8b6914;margin-top:2px;">Just now</div>' : ''}
        </td>
      </tr>`).join('')}
    </table>` : ''}

    ${args.receiptUrl ? `
    <div style="margin:24px 0;">
      ${emailButton(args.receiptUrl, 'View Receipt')}
    </div>` : ''}

    ${goldDivider}

    <p style="margin:0;font-size:13px;line-height:1.7;color:#5b5348;text-align:center;">
      Have questions about your order?<br>
      Reply to this email or call <a href="tel:+16124878228" style="color:#8b6914;">+1 (612) 487-8228</a>.
    </p>

    <div style="margin-top:32px;padding:20px;background:linear-gradient(135deg,#faf3de,#f5e7a3);border-radius:6px;text-align:center;">
      <div style="font-family:Georgia,serif;font-style:italic;font-size:15px;color:#5c4210;line-height:1.5;">
        Visit us in person at Northtown Mall,<br>
        or Mall of America starting August 10, 2026.
      </div>
      <div style="margin-top:12px;">
        <a href="${SITE}/visit" style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8b6914;font-weight:600;text-decoration:none;">Visit Our Stores &rarr;</a>
      </div>
    </div>
  `;

  const text = [
    `Thank you, ${args.customerFirstName}!`,
    ``,
    `Your SINZU order #${orderShort} is confirmed.`,
    ``,
    `Order Summary:`,
    ...args.items.map(li => `  ${li.name} (${li.variation}) x${li.quantity} — ${money(li.priceCents * li.quantity)}`),
    ``,
    `Subtotal: ${money(args.subtotalCents)}`,
    ...(args.discountCents > 0 ? [`Discount ${args.discountCode || ''}: -${money(args.discountCents)}`] : []),
    `Shipping (${args.shippingMethod}): ${args.shippingCents === 0 ? 'Free' : money(args.shippingCents)}`,
    `Total: ${money(args.totalCents)}`,
    ``,
    `Ships to: ${args.shippingAddress.firstName} ${args.shippingAddress.lastName}`,
    `${args.shippingAddress.addressLine1}${args.shippingAddress.addressLine2 ? ', ' + args.shippingAddress.addressLine2 : ''}`,
    `${args.shippingAddress.city}, ${args.shippingAddress.state} ${args.shippingAddress.postalCode}`,
    ``,
    ...(args.receiptUrl ? [`Receipt: ${args.receiptUrl}`, ''] : []),
    `Questions? Reply to this email or call +1 (612) 487-8228.`,
    ``,
    `— SINZU LLC`,
    `${SITE}`,
  ].join('\n');

  return {
    subject,
    html: emailShell({
      preheader: `Order #${orderShort} confirmed — ${money(args.totalCents)}. Ships 1–3 business days.`,
      body,
    }),
    text,
  };
}

/** Welcome email sent when someone subscribes to the newsletter. */
export function welcomeEmail(): { subject: string; html: string; text: string } {
  const subject = 'Welcome to SINZU — here\'s 10% off your first order';

  const body = `
    <h1 class="h1 headline" style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:28px;font-weight:600;color:#1a1200;line-height:1.2;">
      Welcome to the family.
    </h1>
    <p style="margin:0 0 24px 0;font-size:14px;line-height:1.7;color:#5b5348;">
      Thanks for joining us. Here&rsquo;s your <strong>10% off</strong> your first order — use it whenever you&rsquo;re ready.
    </p>

    <div style="text-align:center;margin:32px 0;padding:32px 24px;background:linear-gradient(135deg,#1a1200,#3d2a0e);border-radius:8px;">
      <div style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#e2c471;font-weight:600;">Your Code</div>
      <div style="font-family:Georgia,serif;font-size:36px;font-weight:600;letter-spacing:8px;color:#f5e7a3;margin:12px 0;">
        WELCOME10
      </div>
      <div style="font-size:12px;color:#e2c471;opacity:0.75;">10% off your first order · No minimum</div>
    </div>

    <div style="text-align:center;margin:28px 0;">
      ${emailButton(SITE + '/shop', 'Shop Now')}
    </div>

    ${goldDivider}

    <h2 class="headline" style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:18px;font-weight:600;color:#1a1200;font-style:italic;">
      What we&rsquo;re about
    </h2>
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.7;color:#5b5348;">
      SINZU is a Minnesota retail brand celebrating five years at Northtown Mall — and this August, we&rsquo;re expanding to Mall of America. We handpick every piece of jewelry, every satin bonnet, every ounce of shea butter, so you don&rsquo;t have to.
    </p>
    <p style="margin:0 0 24px 0;font-size:14px;line-height:1.7;color:#5b5348;">
      Watch your inbox for new drops, restocks, and (only occasionally) exclusive offers. No spam — we promise.
    </p>

    <div style="margin-top:32px;padding:20px;background:#faf3de;border-radius:6px;text-align:center;">
      <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8b6914;font-weight:600;">Coming August 10, 2026</div>
      <div style="font-family:Georgia,serif;font-style:italic;font-size:17px;color:#5c4210;margin-top:6px;">
        SINZU at Mall of America
      </div>
      <div style="margin-top:10px;">
        <a href="${SITE}/visit" style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8b6914;font-weight:600;text-decoration:none;">Learn More &rarr;</a>
      </div>
    </div>
  `;

  const text = [
    `Welcome to SINZU!`,
    ``,
    `Your welcome code: WELCOME10 (10% off your first order)`,
    ``,
    `Shop the collection: ${SITE}/shop`,
    ``,
    `SINZU is a Minnesota retail brand celebrating five years at Northtown Mall`,
    `and expanding to Mall of America on August 10, 2026.`,
    ``,
    `Questions? Reply to this email.`,
    `— SINZU LLC`,
  ].join('\n');

  return {
    subject,
    html: emailShell({
      preheader: 'Use WELCOME10 for 10% off · valid on your first order.',
      body,
    }),
    text,
  };
}

/** Notification to the owner when a new order lands. */
export function ownerNewOrderEmail(args: OrderConfirmationArgs & { customerName: string }): { subject: string; html: string; text: string } {
  const orderShort = args.orderId.slice(-8).toUpperCase();
  const subject = `New order #${orderShort} — ${money(args.totalCents)} from ${args.customerName}`;

  const body = `
    <h1 class="h1 headline" style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:24px;font-weight:600;color:#1a1200;">
      New order · #${orderShort}
    </h1>
    <table role="presentation" width="100%" style="margin:16px 0;">
      <tr><td style="padding:6px 0;font-size:14px;color:#5b5348;">Customer</td>
          <td align="right" style="padding:6px 0;font-size:14px;color:#1a1200;font-weight:600;">${escapeHtml(args.customerName)}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#5b5348;">Email</td>
          <td align="right" style="padding:6px 0;font-size:14px;color:#1a1200;">${escapeHtml(args.customerEmail)}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#5b5348;">Items</td>
          <td align="right" style="padding:6px 0;font-size:14px;color:#1a1200;font-weight:600;">${args.items.length} · ${args.items.reduce((s, i) => s + i.quantity, 0)} units</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#5b5348;">Total</td>
          <td align="right" style="padding:6px 0;font-size:14px;color:#1a1200;font-weight:700;">${money(args.totalCents)}</td></tr>
      ${args.discountCode ? `<tr><td style="padding:6px 0;font-size:14px;color:#8b6914;">Code used</td>
          <td align="right" style="padding:6px 0;font-size:14px;color:#8b6914;font-weight:600;">${escapeHtml(args.discountCode)}</td></tr>` : ''}
      <tr><td style="padding:6px 0;font-size:14px;color:#5b5348;">Shipping</td>
          <td align="right" style="padding:6px 0;font-size:14px;color:#1a1200;">${escapeHtml(args.shippingMethod)}</td></tr>
    </table>

    <p style="margin:24px 0 8px 0;font-size:14px;color:#5b5348;">
      Full order details, shipping address, and fulfillment status are in your Square Dashboard.
    </p>
    <div style="margin:16px 0;">
      ${emailButton('https://squareup.com/dashboard/orders', 'Open in Square')}
    </div>
  `;

  const text = [
    `New order #${orderShort}`,
    ``,
    `Customer: ${args.customerName} (${args.customerEmail})`,
    `Items: ${args.items.length} products, ${args.items.reduce((s, i) => s + i.quantity, 0)} units`,
    `Total: ${money(args.totalCents)}`,
    ...(args.discountCode ? [`Code used: ${args.discountCode}`] : []),
    `Shipping: ${args.shippingMethod}`,
    ``,
    `Full details: https://squareup.com/dashboard/orders`,
  ].join('\n');

  return {
    subject,
    html: emailShell({ preheader: `${args.customerName} · ${money(args.totalCents)} · ${args.items.length} items`, body }),
    text,
  };
}

/** Notification to owner when a customer submits a review awaiting approval. */
export function reviewSubmissionEmail(args: {
  productName: string;
  productId: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  title?: string;
  content: string;
}): { subject: string; html: string; text: string } {
  const subject = `New review for ${args.productName} — ${args.rating}/5 stars`;

  const stars = '★'.repeat(args.rating) + '☆'.repeat(5 - args.rating);

  const body = `
    <h1 class="h1 headline" style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:22px;font-weight:600;color:#1a1200;">
      New review awaiting approval
    </h1>

    <div style="margin:16px 0;padding:16px 20px;background:#faf3de;border-radius:6px;">
      <div style="font-size:14px;font-weight:600;color:#1a1200;">${escapeHtml(args.productName)}</div>
      <div style="font-size:20px;color:#c9a227;letter-spacing:2px;margin-top:4px;">${stars}</div>
      ${args.title ? `<div style="margin-top:10px;font-family:Georgia,serif;font-style:italic;font-size:16px;color:#1a1200;">&ldquo;${escapeHtml(args.title)}&rdquo;</div>` : ''}
      <div style="margin-top:10px;font-size:14px;color:#5b5348;line-height:1.7;">${escapeHtml(args.content).replace(/\n/g, '<br>')}</div>
      <div style="margin-top:14px;padding-top:14px;border-top:1px solid #e2c471;font-size:12px;color:#8b6914;">
        By ${escapeHtml(args.reviewerName)} &middot; ${escapeHtml(args.reviewerEmail)}
      </div>
    </div>

    <p style="margin:20px 0;font-size:14px;color:#5b5348;line-height:1.7;">
      To publish this review, add it to <code style="background:#f0e5c9;padding:2px 6px;border-radius:3px;font-size:12px;">data/reviews.json</code> and redeploy. The review payload is at the bottom of this email for easy copy-paste.
    </p>

    <div style="margin:20px 0;padding:16px;background:#1a1200;border-radius:6px;color:#e2c471;font-family:Menlo,Consolas,monospace;font-size:12px;line-height:1.5;overflow:auto;">
${escapeHtml(JSON.stringify({
  productId: args.productId,
  reviewerName: args.reviewerName,
  rating: args.rating,
  title: args.title,
  content: args.content,
  date: new Date().toISOString().slice(0, 10),
  verified: false,
}, null, 2))}
    </div>
  `;

  const text = `New review for ${args.productName} (${args.rating}/5 stars)\n\nBy: ${args.reviewerName} <${args.reviewerEmail}>\n\n${args.title ? args.title + '\n' : ''}${args.content}\n\nTo publish, add to data/reviews.json and redeploy.`;

  return {
    subject,
    html: emailShell({ preheader: `${args.rating}/5 stars from ${args.reviewerName}`, body }),
    text,
  };
}

// tiny escaper — templates go through here, so we don't need a big lib
function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}