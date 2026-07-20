import type { Product } from "@/types";
import { electronicsProducts, fashionProducts } from "./products-electronics-fashion";
import { homeProducts, beautyProducts } from "./products-home-beauty";
import {
  sportsProducts,
  toysProducts,
  booksProducts,
  petsProducts,
} from "./products-sports-toys-books-pets";

const now = Date.now();
const day = 86_400_000;

const allSeedProducts = [
  ...electronicsProducts,
  ...fashionProducts,
  ...homeProducts,
  ...beautyProducts,
  ...sportsProducts,
  ...toysProducts,
  ...booksProducts,
  ...petsProducts,
];

// Stagger createdAt so "newest" sorting and "new arrivals" have realistic variety.
export const productsSeed: Product[] = allSeedProducts.map((p, i) => ({
  ...p,
  createdAt: now - i * day * 2,
  updatedAt: now - i * day,
}));

export const allBrands: string[] = Array.from(new Set(productsSeed.map((p) => p.brand))).sort();
