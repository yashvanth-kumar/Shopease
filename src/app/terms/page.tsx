import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the Terms & Conditions governing your use of the ShopEase website and services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-ink-900">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-ink-500">Last updated: July 1, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-700">
          <section>
            <h2 className="text-lg font-bold text-ink-900">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By accessing or using the ShopEase website, you agree to be bound by these Terms
              &amp; Conditions and our Privacy Policy. If you do not agree, please do not use our
              services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">2. Eligibility</h2>
            <p className="mt-2">
              You must be at least 18 years old, or the age of majority in your jurisdiction, to
              create an account and place orders on ShopEase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">3. Account Registration</h2>
            <p className="mt-2">
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activity that occurs under your account. Please notify us immediately of
              any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">4. Orders and Pricing</h2>
            <p className="mt-2">
              All product descriptions, images, and prices are subject to change without notice.
              We reserve the right to limit quantities, refuse orders, or cancel orders at our
              discretion, including in cases of suspected fraud or pricing errors. Prices are
              listed in U.S. dollars and do not include applicable taxes unless stated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">5. Payment</h2>
            <p className="mt-2">
              We currently accept Cash on Delivery (COD) as our payment method. Payment is due in
              full at the time of delivery. Additional payment methods may be introduced in the
              future.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">6. Shipping and Delivery</h2>
            <p className="mt-2">
              Estimated delivery times are provided for convenience and are not guaranteed.
              ShopEase is not responsible for delays caused by shipping carriers, weather, or
              other events outside our control. See our Shipping Policy for full details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">7. Returns and Refunds</h2>
            <p className="mt-2">
              Returns and refunds are governed by our Return &amp; Refund Policy, which forms part
              of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">8. User Content</h2>
            <p className="mt-2">
              By submitting reviews, ratings, or other content, you grant ShopEase a non-exclusive,
              royalty-free, worldwide license to use, display, and distribute that content in
              connection with our services. You agree not to submit content that is false,
              misleading, defamatory, or infringes on others' rights. We reserve the right to
              moderate, edit, or remove any submitted content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">9. Prohibited Conduct</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Use our website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Interfere with or disrupt the operation of our website</li>
              <li>Submit false or fraudulent orders</li>
              <li>Scrape, copy, or reproduce our content without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">10. Intellectual Property</h2>
            <p className="mt-2">
              All content on ShopEase, including logos, text, graphics, and software, is the
              property of ShopEase or its licensors and is protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">11. Limitation of Liability</h2>
            <p className="mt-2">
              To the fullest extent permitted by law, ShopEase shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of our
              website or products.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">12. Changes to These Terms</h2>
            <p className="mt-2">
              We may revise these Terms at any time. Continued use of our website after changes
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">13. Governing Law</h2>
            <p className="mt-2">
              These Terms are governed by the laws of the State of California, without regard to
              its conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">14. Contact Us</h2>
            <p className="mt-2">
              Questions about these Terms can be sent to{" "}
              <a href="mailto:support@shopease-demo.com" className="text-brand-700 hover:underline">
                support@shopease-demo.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
