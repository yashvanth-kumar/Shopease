import Link from "next/link";
import type { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";

export default function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="container-page py-10 sm:py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
        </div>
        <Link href={viewAllHref} className="hidden text-sm font-semibold text-brand-700 hover:underline sm:block">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link href={viewAllHref} className="btn-outline">
          View all
        </Link>
      </div>
    </section>
  );
}
