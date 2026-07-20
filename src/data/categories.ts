import type { Category } from "@/types";

// Real, complete category data for a multi-category general store.
// Timestamps are static so the dataset is deterministic for the seed script.
const now = Date.now();

export const categoriesSeed: Omit<Category, "createdAt" | "updatedAt">[] = [
  {
    id: "cat-electronics",
    name: "Electronics",
    slug: "electronics",
    description:
      "Laptops, headphones, smart home devices, cameras, and more from trusted brands.",
    imageUrl:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
    parentId: null,
    order: 1,
    featured: true,
    seoTitle: "Shop Electronics Online | ShopEase",
    seoDescription:
      "Browse laptops, audio gear, smart home devices, and cameras with fast shipping and secure checkout.",
  },
  {
    id: "cat-fashion",
    name: "Fashion",
    slug: "fashion",
    description: "Apparel and accessories for men, women, and kids in every season.",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    parentId: null,
    order: 2,
    featured: true,
    seoTitle: "Shop Fashion & Apparel Online | ShopEase",
    seoDescription: "Discover the latest clothing, shoes, and accessories for the whole family.",
  },
  {
    id: "cat-home",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Furniture, cookware, décor, and appliances to make your house a home.",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    parentId: null,
    order: 3,
    featured: true,
    seoTitle: "Home & Kitchen Essentials | ShopEase",
    seoDescription: "Shop furniture, cookware, and home décor with quality guaranteed.",
  },
  {
    id: "cat-beauty",
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    description: "Skincare, haircare, fragrances, and wellness products.",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    parentId: null,
    order: 4,
    featured: true,
    seoTitle: "Beauty & Personal Care Products | ShopEase",
    seoDescription: "Shop skincare, haircare, and fragrance from top-rated brands.",
  },
  {
    id: "cat-sports",
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Fitness gear, camping equipment, and outdoor essentials.",
    imageUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
    parentId: null,
    order: 5,
    featured: true,
    seoTitle: "Sports & Outdoor Gear | ShopEase",
    seoDescription: "Shop fitness equipment, camping gear, and outdoor essentials.",
  },
  {
    id: "cat-toys",
    name: "Toys & Games",
    slug: "toys-games",
    description: "Toys, puzzles, and games for kids of all ages.",
    imageUrl:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
    parentId: null,
    order: 6,
    featured: false,
    seoTitle: "Toys & Games for Kids | ShopEase",
    seoDescription: "Shop the best toys, puzzles, and games for children of every age.",
  },
  {
    id: "cat-books",
    name: "Books & Stationery",
    slug: "books-stationery",
    description: "Bestselling books, notebooks, and office supplies.",
    imageUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    parentId: null,
    order: 7,
    featured: false,
    seoTitle: "Books & Stationery Online | ShopEase",
    seoDescription: "Shop bestselling books, notebooks, and office supplies.",
  },
  {
    id: "cat-pets",
    name: "Pet Supplies",
    slug: "pet-supplies",
    description: "Food, toys, and accessories for your furry friends.",
    imageUrl:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80",
    parentId: null,
    order: 8,
    featured: false,
    seoTitle: "Pet Supplies Online | ShopEase",
    seoDescription: "Shop pet food, toys, and accessories for dogs, cats, and more.",
  },
];

export function withTimestamps<T extends { id: string }>(items: T[]) {
  return items.map((item) => ({ ...item, createdAt: now, updatedAt: now }));
}
