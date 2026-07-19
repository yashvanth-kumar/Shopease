import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about ShopEase's mission to make quality products accessible to everyone through fast shipping, fair prices, and honest service.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">About ShopEase</h1>
        <p className="mt-4 text-lg text-ink-600">
          We started ShopEase with a simple belief: online shopping should be easy, honest, and
          enjoyable — not overwhelming.
        </p>
      </div>

      <div className="relative mx-auto mt-10 aspect-[21/9] max-w-4xl overflow-hidden rounded-xl2">
        <Image
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80"
          alt="ShopEase team working in a modern office"
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-6 text-ink-700">
        <p>
          Founded in 2021, ShopEase began as a small team frustrated by cluttered, slow online
          stores. We set out to build something different: a shopping experience that respects
          your time, your data, and your money. Today we serve customers across the country with
          a catalog spanning electronics, fashion, home goods, beauty, sports equipment, toys,
          books, and pet supplies.
        </p>
        <p>
          Every product on ShopEase is selected with quality and value in mind. We work directly
          with manufacturers and trusted distributors to cut out unnecessary markups, and we
          stand behind everything we sell with a straightforward 30-day return policy.
        </p>
        <p>
          Our small but dedicated team handles everything from product curation to customer
          support, which means when you reach out with a question, you're talking to someone who
          actually cares about getting it right.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-3">
        {[
          { stat: "50,000+", label: "Happy Customers" },
          { stat: "25+", label: "Product Categories" },
          { stat: "4.6/5", label: "Average Rating" },
        ].map((item) => (
          <div key={item.label} className="card p-6 text-center">
            <p className="font-display text-2xl font-bold text-brand-700">{item.stat}</p>
            <p className="mt-1 text-sm text-ink-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
