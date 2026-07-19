import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoriesSeed, withTimestamps } from "@/data/categories";
import { productsSeed } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";

interface Props {
  params: { slug: string };
}

function getCategory(slug: string) {
  return withTimestamps(categoriesSeed).find((c) => c.slug === slug);
}

export function generateStaticParams() {
  return categoriesSeed.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const category = getCategory(params.slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description,
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

export default function CategoryDetailPage({ params }: Props) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const products = productsSeed.filter((p) => p.categorySlug === category.slug && p.isActive);

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-500">
        <ol className="flex items-center gap-1.5">
          <li><a href="/" className="hover:text-brand-700">Home</a></li>
          <li>/</li>
          <li><a href="/categories" className="hover:text-brand-700">Categories</a></li>
          <li>/</li>
          <li className="font-medium text-ink-900">{category.name}</li>
        </ol>
      </nav>

      <h1 className="font-display text-3xl font-bold text-ink-900">{category.name}</h1>
      <p className="mt-2 max-w-2xl text-ink-500">{category.description}</p>
      <p className="mt-1 text-sm text-ink-400">{products.length} products</p>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
