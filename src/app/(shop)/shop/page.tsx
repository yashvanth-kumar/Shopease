import type { Metadata } from "next";
import { Suspense } from "react";
import ShopPageClient from "@/components/product/ShopPageClient";
import { ProductGridSkeleton } from "@/components/product/ProductGrid";
import { getAllCategories } from "@/lib/firebase/categories";
import { getAllActiveProducts } from "@/lib/firebase/products";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse our full catalog of electronics, fashion, home goods, beauty products, and more. Filter by category, brand, price, and rating.",
  alternates: { canonical: "/shop" },
};

export const revalidate = 60;

export default async function ShopPage() {
  const [categories, products] = await Promise.all([
    getAllCategories(),
    getAllActiveProducts(),
  ]);
  const brands = Array.from(new Set(products.map((p) => p.brand))).sort();

  return (
    <Suspense fallback={<div className="container-page py-8"><ProductGridSkeleton /></div>}>
      <ShopPageClient allProducts={products} categories={categories} brands={brands} />
    </Suspense>
  );
}
