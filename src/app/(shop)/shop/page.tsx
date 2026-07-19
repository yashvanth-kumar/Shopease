import type { Metadata } from "next";
import { Suspense } from "react";
import ShopPageClient from "@/components/product/ShopPageClient";
import { ProductGridSkeleton } from "@/components/product/ProductGrid";
import { categoriesSeed, withTimestamps } from "@/data/categories";
import { productsSeed, allBrands } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse our full catalog of electronics, fashion, home goods, beauty products, and more. Filter by category, brand, price, and rating.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  const categories = withTimestamps(categoriesSeed);

  return (
    <Suspense fallback={<div className="container-page py-8"><ProductGridSkeleton /></div>}>
      <ShopPageClient allProducts={productsSeed} categories={categories} brands={allBrands} />
    </Suspense>
  );
}
