import type { MetadataRoute } from "next";
import { getAllActiveProducts } from "@/lib/firebase/products";
import { getAllCategories } from "@/lib/firebase/categories";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shopease-demo.web.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/shipping-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/return-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const [categories, products] = await Promise.all([
    getAllCategories(),
    getAllActiveProducts(),
  ]);

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/categories/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
  url: `${SITE_URL}/product/${p.slug}`,
  lastModified:
    p.updatedAt && typeof (p.updatedAt as any).toDate === "function"
      ? (p.updatedAt as any).toDate()
      : new Date(),
  changeFrequency: "weekly",
  priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
