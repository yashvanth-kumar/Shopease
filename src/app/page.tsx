import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import ProductSection from "@/components/home/ProductSection";
import TrustBadges from "@/components/home/TrustBadges";
import { categoriesSeed, withTimestamps } from "@/data/categories";
import { productsSeed } from "@/data/products";

export const metadata: Metadata = {
  title: "ShopEase — Shop Electronics, Fashion, Home & More Online",
  description:
    "Discover quality products across electronics, fashion, home, beauty, and more. Fast shipping, secure checkout, and easy returns at ShopEase.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const categories = withTimestamps(categoriesSeed).filter((c) => c.featured);
  const featured = productsSeed.filter((p) => p.featured).slice(0, 10);
  const newArrivals = [...productsSeed]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10);

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
