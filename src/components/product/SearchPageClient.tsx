"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { productsSeed } from "@/data/products";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";

  const results = useMemo(() => {
    if (!q) return [];
    const term = q.toLowerCase();
    return productsSeed.filter(
      (p) =>
        p.isActive &&
        (p.title.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.categorySlug.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term)))
    );
  }, [q]);

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
        {q ? `Search results for "${q}"` : "Search Products"}
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        {q ? `${results.length} products found` : "Enter a search term to find products"}
      </p>

      <div className="mt-8">
        <ProductGrid products={results} />
      </div>
    </div>
  );
}
