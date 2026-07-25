"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductGrid";
import { getAllActiveProducts } from "@/lib/firebase/products";
import type { Product } from "@/types";

export default function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";
  const [inputValue, setInputValue] = useState(q);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllActiveProducts()
      .then(setAllProducts)
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const results = (() => {
    if (!q) return [];
    const term = q.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.categorySlug.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term))
    );
  })();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
        {q ? `Search results for "${q}"` : "Search Products"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-4 max-w-lg" role="search">
        <div className="relative">
          <SearchIcon
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search products, brands..."
            aria-label="Search products"
            autoFocus
            className="input-field pl-10"
          />
        </div>
      </form>

      <p className="mt-4 text-sm text-ink-500">
        {q ? `${results.length} products found` : "Enter a search term to find products"}
      </p>

      <div className="mt-8">
        {loading ? <ProductGridSkeleton /> : <ProductGrid products={results} />}
      </div>
    </div>
  );
}
