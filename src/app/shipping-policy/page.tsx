import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Learn about ShopEase's shipping rates, delivery timeframes, and order tracking.",
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-ink-900">Shipping Policy</h1>
        <p className="mt-2 text-sm text-ink-500">Last updated: July 1, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-700">
          <section>
            <h2 className="text-lg font-bold text-ink-900">Shipping Rates</h2>
            <p className="mt-2">
              We offer flat-rate shipping of $4.99 on all orders. Orders totaling $50 or more
              qualify for <strong>free standard shipping</strong> automatically applied at
              checkout — no code needed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Delivery Timeframes</h2>
            <table className="mt-3 w-full border-collapse overflow-hidden rounded-lg border border-ink-200 text-left text-sm">
              <thead className="bg-ink-50">
                <tr>
                  <th className="border-b border-ink-200 px-4 py-2 font-semibold text-ink-900">Shipping Method</th>
                  <th className="border-b border-ink-200 px-4 py-2 font-semibold text-ink-900">Estimated Delivery</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-ink-100 px-4 py-2">Standard Shipping</td>
                  <td className="border-b border-ink-100 px-4 py-2">3–7 business days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Remote Areas</td>
                  <td className="px-4 py-2">7–12 business days</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-ink-500">
              Delivery times are estimates and begin counting from the date your order ships, not
              the date it was placed. Orders are typically processed within 1-2 business days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Order Tracking</h2>
            <p className="mt-2">
              Once your order ships, you'll receive an email with a tracking number. You can also
              view tracking information anytime from the{" "}
              <a href="/orders" className="text-brand-700 hover:underline">
                Order History
              </a>{" "}
              page in your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Shipping Restrictions</h2>
            <p className="mt-2">
              We currently ship only to addresses within the United States, including Alaska and
              Hawaii. We do not ship to P.O. boxes for certain oversized items. International
              shipping is not currently available but is planned for the future.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Delayed or Lost Packages</h2>
            <p className="mt-2">
              If your package hasn't arrived within the estimated delivery window, please check
              your tracking information first. If there's no update after 2 additional business
              days, contact our support team at{" "}
              <a href="mailto:support@shopease-demo.com" className="text-brand-700 hover:underline">
                support@shopease-demo.com
              </a>{" "}
              and we'll investigate with the carrier or arrange a replacement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Address Accuracy</h2>
            <p className="mt-2">
              Please double-check your shipping address at checkout. We are not responsible for
              orders delayed or lost due to an incorrect address provided by the customer, though
              we're happy to help redirect a shipment where possible.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
