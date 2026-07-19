import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { categoriesSeed, withTimestamps } from "@/data/categories";

export const metadata: Metadata = {
  title: "Shop by Category",
  description:
    "Browse all product categories at ShopEase, including electronics, fashion, home & kitchen, beauty, sports, toys, books, and pet supplies.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const categories = withTimestamps(categoriesSeed);

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-bold text-ink-900">Shop by Category</h1>
      <p className="mt-2 text-ink-500">Explore our full range of product categories</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="card group overflow-hidden hover:shadow-card-hover"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h2 className="font-display text-lg font-semibold text-ink-900">{category.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-ink-500">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
