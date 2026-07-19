import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";

export default function CategoryShowcase({ categories }: { categories: Category[] }) {
  return (
    <section className="container-page py-12 sm:py-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            Shop by Category
          </h2>
          <p className="mt-1 text-sm text-ink-500">Explore our full range of product categories</p>
        </div>
        <Link href="/categories" className="hidden text-sm font-semibold text-brand-700 hover:underline sm:block">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl2 bg-ink-100"
          >
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className="absolute bottom-3 left-3 font-display text-base font-semibold text-white sm:text-lg">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
