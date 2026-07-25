import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import ProductSection from "@/components/home/ProductSection";
import TrustBadges from "@/components/home/TrustBadges";
import { getFeaturedCategories } from "@/lib/firebase/categories";
import { getFeaturedProducts, getNewArrivals } from "@/lib/firebase/products";

export const metadata: Metadata = {
  title: "ShopEase — Shop Electronics, Fashion, Home & More Online",
  description:
    "Discover quality products across electronics, fashion, home, beauty, and more. Fast shipping, secure checkout, and easy returns at ShopEase.",
  alternates: { canonical: "/" },
};

// Revalidate this page periodically so new/edited products from the admin
// panel show up on the live storefront without needing a full redeploy.
export const revalidate = 60;

export default async function HomePage() {
  const [categories, featured, newArrivals] = await Promise.all([
    getFeaturedCategories(),
    getFeaturedProducts(10),
    getNewArrivals(10),
  ]);

  return (
    <>
      <Hero />
      <TrustBadges />
      <CategoryShowcase categories={categories} />
      <ProductSection
        title="Featured Products"
        subtitle="Hand-picked items our customers love"
        products={featured}
        viewAllHref="/shop?featured=true"
      />
      <div className="bg-ink-50">
        <ProductSection
          title="New Arrivals"
          subtitle="Just landed — be the first to shop them"
          products={newArrivals}
          viewAllHref="/shop?sort=newest"
        />
      </div>
    </>
  );
}
