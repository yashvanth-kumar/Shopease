import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: "Learn about ShopEase's 30-day return window, refund process, and exceptions.",
  alternates: { canonical: "/return-policy" },
};

export default function ReturnPolicyPage() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-ink-900">Return &amp; Refund Policy</h1>
        <p className="mt-2 text-sm text-ink-500">Last updated: July 1, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-700">
          <section>
            <h2 className="text-lg font-bold text-ink-900">30-Day Return Window</h2>
            <p className="mt-2">
              We want you to love what you ordered. If you're not satisfied, most items can be
              returned within <strong>30 days</strong> of the delivery date for a full refund or
              exchange.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Return Conditions</h2>
            <p className="mt-2">To be eligible for a return, items must be:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Unused and in the same condition you received them</li>
              <li>In the original packaging with all tags attached</li>
              <li>Accompanied by proof of purchase (order number or confirmation email)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Non-Returnable Items</h2>
            <p className="mt-2">The following items cannot be returned:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Personal care and beauty items that have been opened or used</li>
              <li>Underwear and swimwear where hygiene liners have been removed</li>
              <li>Gift cards</li>
              <li>Items marked "Final Sale" at the time of purchase</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">How to Start a Return</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>
                Go to{" "}
                <a href="/orders" className="text-brand-700 hover:underline">
                  Order History
                </a>{" "}
                and select the order containing the item you'd like to return.
              </li>
              <li>Click "Request Return" and select a reason for the return.</li>
              <li>Our support team will confirm the return and provide instructions.</li>
              <li>Pack the item securely and ship it back using the provided instructions.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Refunds</h2>
            <p className="mt-2">
              Once we receive and inspect your return, we'll notify you of the approval status.
              Approved refunds are processed within 5-7 business days. Since ShopEase currently
              operates on a Cash on Delivery basis, refunds for COD orders are issued via bank
              transfer or store credit, based on your preference at the time of the return request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Exchanges</h2>
            <p className="mt-2">
              Need a different size or color instead of a refund? Select "Exchange" when starting
              your return request, and we'll ship the replacement as soon as we receive the
              original item.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Damaged or Defective Items</h2>
            <p className="mt-2">
              If an item arrives damaged or defective, contact us within 7 days of delivery at{" "}
              <a href="mailto:support@shopease-demo.com" className="text-brand-700 hover:underline">
                support@shopease-demo.com
              </a>{" "}
              with photos of the issue. We'll arrange a free replacement or full refund — no return
              shipping cost to you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Return Shipping Costs</h2>
            <p className="mt-2">
              Customers are responsible for return shipping costs unless the return is due to our
              error (wrong item shipped, defective product, etc.), in which case we cover the
              cost.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
