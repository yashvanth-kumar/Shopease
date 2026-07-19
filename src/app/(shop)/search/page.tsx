import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPageClient from "@/components/product/SearchPageClient";
import { ProductGridSkeleton } from "@/components/product/ProductGrid";

export const metadata: Metadata = {
  title: "Search Products",
  description: "Search ShopEase's full catalog of electronics, fashion, home goods, and more.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-page py-8"><ProductGridSkeleton /></div>}>
      <SearchPageClient />
    </Suspense>
  );
}
