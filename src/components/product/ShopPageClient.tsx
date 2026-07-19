"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import ShopFilters, { type ShopFiltersState } from "@/components/product/ShopFilters";
import type { Category, Product } from "@/types";

const PAGE_SIZE = 12;

export default function ShopPageClient({
  allProducts,
  categories,
  brands,
}: {
  allProducts: Product[];
  categories: Category[];
  brands: string[];
}) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ShopFiltersState>({
    categorySlug: searchParams.get("category") ?? undefined,
    brands: [],
    minRating: undefined,
  });
  const [sort, setSort] = useState(searchParams.get("sort") ?? "newest");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const featuredOnly = searchParams.get("featured") === "true";

  const filtered = useMemo(() => {
    let result = allProducts.filter((p) => p.isActive);
    if (featuredOnly) result = result.filter((p) => p.featured);
    if (filters.categorySlug) result = result.filter((p) => p.categorySlug === filters.categorySlug);
    if (filters.brands.length > 0) result = result.filter((p) => filters.brands.includes(p.brand));
    if (filters.minPrice !== undefined) result = result.filter((p) => p.price >= filters.minPrice!);
    if (filters.maxPrice !== undefined) result = result.filter((p) => p.price <= filters.maxPrice!);
    if (filters.minRating !== undefined) result = result.filter((p) => p.rating >= filters.minRating!);

    switch (sort) {
      case "price_asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        result = [...result].sort((a, b) => b.createdAt - a.createdAt);
    }

    return result;
  }, [allProducts, filters, sort, featuredOnly]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            {featuredOnly ? "Featured Products" : "Shop All Products"}
          </h1>
          <p className="mt-1 text-sm text-ink-500">{filtered.length} products found</p>
        </div>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="btn-outline lg:hidden"
          aria-label="Open filters"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        <div className="hidden lg:block">
          <ShopFilters
            categories={categories}
            brands={brands}
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
          />
        </div>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white p-4 animate-slideUp">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <X size={22} />
                </button>
              </div>
              <ShopFilters
                categories={categories}
                brands={brands}
                filters={filters}
                onChange={(f) => {
                  setFilters(f);
                  setPage(1);
                }}
              />
              <button onClick={() => setMobileFiltersOpen(false)} className="btn-primary mt-4 w-full">
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="mb-4 flex justify-end">
            <label className="sr-only" htmlFor="sort-select">
              Sort products
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field w-auto !py-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <ProductGrid products={paginated} />

          {hasMore && (
            <div className="mt-8 text-center">
              <button onClick={() => setPage((p) => p + 1)} className="btn-outline">
                Load More Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
