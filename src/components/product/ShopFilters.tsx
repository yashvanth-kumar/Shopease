"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export interface ShopFiltersState {
  categorySlug?: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink-100 py-4">
      <button
        className="flex w-full items-center justify-between text-sm font-semibold text-ink-900"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {title}
        <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function ShopFilters({
  categories,
  brands,
  filters,
  onChange,
}: {
  categories: Category[];
  brands: string[];
  filters: ShopFiltersState;
  onChange: (filters: ShopFiltersState) => void;
}) {
  return (
    <aside className="w-full lg:w-64 lg:shrink-0" aria-label="Product filters">
      <FilterSection title="Category">
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
            <input
              type="radio"
              name="category"
              checked={!filters.categorySlug}
              onChange={() => onChange({ ...filters, categorySlug: undefined })}
              className="h-4 w-4 accent-brand-600"
            />
            All Categories
          </label>
          {categories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
              <input
                type="radio"
                name="category"
                checked={filters.categorySlug === c.slug}
                onChange={() => onChange({ ...filters, categorySlug: c.slug })}
                className="h-4 w-4 accent-brand-600"
              />
              {c.name}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Brand">
        <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
          {brands.map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => {
                  const newBrands = filters.brands.includes(brand)
                    ? filters.brands.filter((b) => b !== brand)
                    : [...filters.brands, brand];
                  onChange({ ...filters, brands: newBrands });
                }}
                className="h-4 w-4 rounded accent-brand-600"
              />
              {brand}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="input-field !py-1.5 text-sm"
            aria-label="Minimum price"
          />
          <span className="text-ink-400">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="input-field !py-1.5 text-sm"
            aria-label="Maximum price"
          />
        </div>
      </FilterSection>

      <FilterSection title="Minimum Rating">
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => onChange({ ...filters, minRating: r })}
                className="h-4 w-4 accent-brand-600"
              />
              {r}+ Stars
            </label>
          ))}
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
            <input
              type="radio"
              name="rating"
              checked={!filters.minRating}
              onChange={() => onChange({ ...filters, minRating: undefined })}
              className="h-4 w-4 accent-brand-600"
            />
            Any Rating
          </label>
        </div>
      </FilterSection>

      <button
        onClick={() => onChange({ brands: [] })}
        className="mt-4 text-sm font-medium text-brand-700 hover:underline"
      >
        Clear all filters
      </button>
    </aside>
  );
}
