import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read ShopEase's Privacy Policy to learn how we collect, use, and protect your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-ink-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ink-500">Last updated: July 1, 2026</p>

        <div className="prose-content mt-8 space-y-6 text-sm leading-relaxed text-ink-700">
          <section>
            <h2 className="text-lg font-bold text-ink-900">1. Introduction</h2>
            <p className="mt-2">
              ShopEase ("we," "us," or "our") respects your privacy and is committed to protecting
              your personal data. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website or make a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">2. Information We Collect</h2>
            <p className="mt-2">We collect information you provide directly to us, including:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Account information: name, email address, phone number, and password</li>
              <li>Order information: shipping address, billing address, and order history</li>
              <li>Communications: messages you send through our contact form or customer support</li>
              <li>Reviews and content you submit, such as product reviews and ratings</li>
            </ul>
            <p className="mt-2">
              We also automatically collect certain information when you use our site, such as IP
              address, browser type, device information, and pages visited, through cookies and
              similar technologies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">3. How We Use Your Information</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>To process and fulfill your orders, including shipping and customer service</li>
              <li>To create and manage your account</li>
              <li>To send transactional emails such as order confirmations and shipping updates</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To improve our website, products, and services</li>
              <li>To detect, prevent, and address fraud, security, or technical issues</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">4. How We Share Your Information</h2>
            <p className="mt-2">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Service providers who help us operate our business (e.g. hosting, email delivery)</li>
              <li>Shipping carriers to deliver your orders</li>
              <li>Law enforcement or regulators when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">5. Data Security</h2>
            <p className="mt-2">
              We implement industry-standard security measures to protect your data, including
              encrypted connections (HTTPS/TLS), password hashing, and access controls that
              restrict who within our organization can view your information. However, no method
              of transmission over the internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">6. Your Rights and Choices</h2>
            <p className="mt-2">
              You may access, update, or delete your account information at any time through your
              Profile page. You can also request a copy of your data or ask us to delete your
              account by contacting support@shopease-demo.com. Depending on your location, you may
              have additional rights under laws such as the GDPR or CCPA.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">7. Cookies</h2>
            <p className="mt-2">
              We use cookies and similar technologies to keep you signed in, remember your cart
              contents, and understand how visitors use our site. You can control cookies through
              your browser settings, though disabling them may affect site functionality.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">8. Children's Privacy</h2>
            <p className="mt-2">
              Our services are not directed to children under 13, and we do not knowingly collect
              personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">9. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. We will notify you of material
              changes by posting the updated policy on this page with a new "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">10. Contact Us</h2>
            <p className="mt-2">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:support@shopease-demo.com" className="text-brand-700 hover:underline">
                support@shopease-demo.com
              </a>{" "}
              or 500 Market Street, Suite 200, San Francisco, CA 94105.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
