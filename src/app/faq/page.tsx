"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_CATEGORIES = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping typically takes 3-7 business days depending on your location. You'll receive a confirmation email with tracking information as soon as your order ships.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! Orders over $50 qualify for free standard shipping. Orders under $50 have a flat shipping fee of $4.99.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order ships, you can track it from the Order History page in your account, or using the tracking number in your confirmation email.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently we only ship within the United States. We're working on expanding to more countries soon.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return window on most items from the delivery date. Items must be unused, in original packaging, with tags attached. See our Return & Refund Policy page for full details.",
      },
      {
        q: "How do I start a return?",
        a: "Go to your Order History, select the order, and click 'Request Return'. Our support team will guide you through the next steps.",
      },
      {
        q: "When will I get my refund?",
        a: "Refunds are typically processed within 5-7 business days after we receive and inspect your returned item.",
      },
    ],
  },
  {
    category: "Account & Payment",
    items: [
      {
        q: "Do I need an account to place an order?",
        a: "You can browse and add items to your cart without an account, but you'll need to create one or sign in to complete checkout so we can send order updates and let you track history.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We currently support Cash on Delivery (COD) for all orders, with additional payment options coming soon.",
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot password?' on the login page and enter your email. We'll send you a secure link to reset your password.",
      },
    ],
  },
  {
    category: "Products",
    items: [
      {
        q: "Are your product reviews verified?",
        a: "Reviews marked 'Verified Purchase' come from customers who purchased the item through ShopEase. All reviews are moderated before publishing.",
      },
      {
        q: "What if an item is out of stock?",
        a: "Out-of-stock items are clearly marked on the product page. You can still browse similar or related products shown on the same page.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink-100 py-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-ink-900">{q}</span>
        <ChevronDown size={18} className={cn("shrink-0 text-ink-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && <p className="mt-2 text-sm leading-relaxed text-ink-600">{a}</p>}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-ink-600">
          Find quick answers to common questions about orders, shipping, returns, and more.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-10">
        {FAQ_CATEGORIES.map((cat) => (
          <div key={cat.category}>
            <h2 className="font-display text-lg font-bold text-brand-700">{cat.category}</h2>
            <div className="mt-2">
              {cat.items.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-2xl rounded-xl2 bg-ink-50 p-6 text-center">
        <p className="font-medium text-ink-900">Still have questions?</p>
        <p className="mt-1 text-sm text-ink-500">Our support team is happy to help.</p>
        <a href="/contact" className="btn-primary mt-4 inline-flex">
          Contact Us
        </a>
      </div>
    </div>
  );
}
