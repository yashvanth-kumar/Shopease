"use client";

import { useEffect, useState } from "react";
import { useRecentlyViewedStore } from "@/context/recentlyViewedStore";
import { getProductsByIds } from "@/lib/firebase/products";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

export default function RecentlyViewedSection({ excludeId }: { excludeId?: string }) {
  const productIds = useRecentlyViewedStore((s) => s.productIds);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const ids = productIds.filter((id) => id !== excludeId).slice(0, 6);
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    getProductsByIds(ids)
      .then((found) => {
        // Preserve the most-recently-viewed-first order from the store,
        // since Firestore's "in" query doesn't guarantee result ordering.
        const ordered = ids
          .map((id) => found.find((p) => p.id === id))
          .filter((p): p is Product => Boolean(p));
        setProducts(ordered);
      })
      .catch(() => setProducts([]));
  }, [productIds, excludeId]);

  if (products.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="font-display text-xl font-bold text-ink-900">Recently Viewed</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
