'use client';

import PolicyLayout from '@/components/PolicyLayout';

export default function ShippingInfoPage() {
  return (
    <PolicyLayout eyebrow="Orders & Delivery" title="Shipping Information" lastUpdated="July 2026">
      <p>
        We ship every order with care from our Minnesota location. Here&apos;s what to expect.
      </p>

      <h2>Processing Time</h2>
      <p>
        Orders are typically processed within <strong>1–3 business days</strong>. During major launches or the holiday season, please allow up to 5 business days. You&apos;ll get a confirmation email when your order ships, with a tracking number.
      </p>

      <h2>Shipping Options & Rates</h2>
      <ul>
        <li><strong>Standard Shipping</strong> — $10.00 · 5–7 business days · <strong>Free on orders over $150</strong></li>
        <li><strong>Express Shipping</strong> — $25.00 · 2–3 business days</li>
      </ul>
      <p>
        All shipping times are estimates once your order is picked up by the carrier. We&apos;re not able to guarantee delivery dates.
      </p>

      <h2>Where We Ship</h2>
      <p>
        We currently ship <strong>throughout the United States</strong>, including Alaska, Hawaii, and U.S. territories (additional transit time may apply). International shipping is coming soon — join our newsletter to be notified when it launches.
      </p>

      <h2>Local Pickup</h2>
      <p>
        Free local pickup is available at our Northtown Mall location. Choose &quot;Local Pickup&quot; at checkout, and you&apos;ll receive an email when your order is ready — usually the same day. Starting August 10, 2026, pickup will also be available at Mall of America.
      </p>

      <h2>Order Tracking</h2>
      <p>
        Once your order ships, you&apos;ll receive an email with tracking. If you don&apos;t see it, please check your spam folder. If tracking hasn&apos;t updated within 48 hours of the shipping notification, contact us and we&apos;ll investigate.
      </p>

      <h2>Damaged or Missing Packages</h2>
      <p>
        If your package arrives damaged, take photos of the outer box and contents and contact us within 48 hours. For lost packages, we&apos;ll open a claim with the carrier and either replace your order or issue a full refund.
      </p>

      <h2>Address Changes</h2>
      <p>
        If you need to change the shipping address on an order, contact us immediately at <a href="tel:+16124878228">+1 (612) 487-8228</a>. Once a package has been picked up by the carrier, we&apos;re unable to redirect it.
      </p>
    </PolicyLayout>
  );
}
