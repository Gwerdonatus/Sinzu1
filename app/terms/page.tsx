'use client';

import PolicyLayout from '@/components/PolicyLayout';

export default function TermsPage() {
  return (
    <PolicyLayout eyebrow="Legal" title="Terms of Service" lastUpdated="July 2026">
      <p>
        Welcome to $INZU. By accessing or using our website at <a href="https://sinzu.shop">sinzu.shop</a>, purchasing products, or visiting our physical locations, you agree to these Terms of Service. Please read them carefully.
      </p>

      <h2>1. About Us</h2>
      <p>
        $INZU is a Minnesota-based retail brand offering jewelry, haircare, and skincare products. Our current storefront is at Northtown Mall in Blaine, MN, with a new location opening at Mall of America in August 2026.
      </p>

      <h2>2. Products & Availability</h2>
      <p>
        We aim to display accurate product information, colors, and stock levels. However, product colors may vary slightly on your screen versus in person, and inventory can change quickly. If a product becomes unavailable after you place an order, we&apos;ll notify you and issue a full refund.
      </p>

      <h2>3. Orders & Payment</h2>
      <p>
        By placing an order, you confirm the payment method belongs to you and that the shipping information is accurate. All payments are processed securely through Square. We accept major credit and debit cards, Apple Pay, and Google Pay. Prices are listed in U.S. dollars and may change without notice, though your confirmed order price will not change.
      </p>

      <h2>4. Discount Codes</h2>
      <p>
        Discount codes are single-use unless otherwise stated, cannot be combined with other offers, and expire on the date noted. We reserve the right to disable codes that are abused or shared publicly.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        All content on this website — including logos, product photography, text, and design — is the property of $INZU or its licensors. You may not reproduce, distribute, or use any content for commercial purposes without written permission.
      </p>

      <h2>6. User Conduct</h2>
      <p>
        You agree not to use our website or services for any unlawful purpose, to attempt unauthorized access to our systems, or to interfere with other customers&apos; use of the site.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        $INZU is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our maximum liability is limited to the amount you paid for the specific product or order in question.
      </p>

      <h2>8. Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the website after changes are posted means you accept the updated terms.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions? Reach us at <a href="tel:+16124878228">+1 (612) 487-8228</a> or through our <a href="/contact">contact page</a>.
      </p>
    </PolicyLayout>
  );
}
