'use client';

import PolicyLayout from '@/components/PolicyLayout';

export default function RefundPage() {
  return (
    <PolicyLayout eyebrow="Support" title="Returns & Refunds" lastUpdated="July 2026">
      <p>
        We stand behind every product we sell. Because our haircare and skincare products are personal-care items, most of our catalog is non-returnable for hygiene reasons, but we&apos;re committed to making things right if something goes wrong.
      </p>

      <h2>Eligible Returns</h2>
      <ul>
        <li><strong>Jewelry</strong> — unworn, in original packaging, within 14 days of delivery.</li>
        <li><strong>Damaged or defective items</strong> from any category — contact us within 48 hours of delivery.</li>
        <li><strong>Wrong item shipped</strong> — we&apos;ll cover return shipping and send the correct item.</li>
      </ul>

      <h2>Non-Returnable Items</h2>
      <ul>
        <li>African Black Soap, Shea Butter, and all skincare products (opened or unopened) for hygiene reasons.</li>
        <li>Bonnets, durags, and any worn haircare items.</li>
        <li>Sale or clearance items marked &quot;final sale.&quot;</li>
        <li>Gift cards.</li>
      </ul>

      <h2>How to Start a Return</h2>
      <p>
        Contact us at <a href="tel:+16124878228">+1 (612) 487-8228</a> or through our <a href="/contact">contact page</a> with your order number and a description of the issue. For damaged items, please include clear photos. We&apos;ll respond within 1–2 business days with next steps.
      </p>

      <h2>Refund Processing</h2>
      <p>
        Approved refunds are issued to your original payment method within 5–10 business days after we receive the returned item. Shipping costs are non-refundable unless the return is due to our error (wrong or damaged item).
      </p>

      <h2>Exchanges</h2>
      <p>
        We handle exchanges as separate transactions: place a new order for the item you want, and return the original for a refund. This gets you the new item faster.
      </p>

      <h2>In-Store Returns</h2>
      <p>
        You may return eligible items at our Northtown Mall location during regular mall hours. Please bring your order confirmation or receipt. From August 10, 2026 onward, returns will also be accepted at our Mall of America kiosk.
      </p>
    </PolicyLayout>
  );
}
