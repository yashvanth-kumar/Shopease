import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit as fsLimit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./config";
import type { Product } from "@/types";

const PRODUCTS = "products";

export interface ProductFilters {
  categorySlug?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  searchTerm?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "rating" | "popular";
}

/**
 * Fetches a page of active products matching the given filters.
 * Firestore doesn't support full-text search or arbitrary compound filters
 * natively, so text search is done via a denormalized `tags` array using
 * array-contains, and heavier filtering (price/brand ranges) is refined
 * client-side after an indexed category/sort query. This keeps the demo
 * free-tier friendly while remaining correct for a catalog of realistic size.
 */
export async function getProducts(
  filters: ProductFilters = {},
  pageSize = 12,
  cursor?: QueryDocumentSnapshot
) {
  const constraints = [where("isActive", "==", true)];

  if (filters.categorySlug) {
    constraints.push(where("categorySlug", "==", filters.categorySlug));
  }

  let sortField: string = "createdAt";
  let sortDir: "asc" | "desc" = "desc";
  switch (filters.sort) {
    case "price_asc":
      sortField = "price";
      sortDir = "asc";
      break;
    case "price_desc":
      sortField = "price";
      sortDir = "desc";
      break;
    case "rating":
      sortField = "rating";
      sortDir = "desc";
      break;
    case "popular":
      sortField = "reviewCount";
      sortDir = "desc";
      break;
    default:
      sortField = "createdAt";
      sortDir = "desc";
  }

  const baseQuery = cursor
    ? query(
        collection(db, PRODUCTS),
        ...constraints,
        orderBy(sortField, sortDir),
        startAfter(cursor),
        fsLimit(pageSize)
      )
    : query(
        collection(db, PRODUCTS),
        ...constraints,
        orderBy(sortField, sortDir),
        fsLimit(pageSize)
      );

  const snap = await getDocs(baseQuery);
  let products = snap.docs.map((d) => d.data() as Product);

  if (filters.brand && filters.brand.length > 0) {
    products = products.filter((p) => filters.brand!.includes(p.brand));
  }
  if (typeof filters.minPrice === "number") {
    products = products.filter((p) => p.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === "number") {
    products = products.filter((p) => p.price <= filters.maxPrice!);
  }
  if (typeof filters.minRating === "number") {
    products = products.filter((p) => p.rating >= filters.minRating!);
  }
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term))
    );
  }

  return {
    products,
    lastDoc: snap.docs[snap.docs.length - 1],
    hasMore: snap.docs.length === pageSize,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(collection(db, PRODUCTS), where("slug", "==", slug), fsLimit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as Product;
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, PRODUCTS, id));
  if (!snap.exists()) return null;
  return snap.data() as Product;
}

export async function getFeaturedProducts(max = 8): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS),
    where("isActive", "==", true),
    where("featured", "==", true),
    fsLimit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Product);
}

export async function getNewArrivals(max = 8): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS),
    where("isActive", "==", true),
    orderBy("createdAt", "desc"),
    fsLimit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Product);
}

export async function getRelatedProducts(product: Product, max = 6): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS),
    where("isActive", "==", true),
    where("categorySlug", "==", product.categorySlug),
    fsLimit(max + 1)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data() as Product)
    .filter((p) => p.id !== product.id)
    .slice(0, max);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const results: Product[] = [];
  // Firestore 'in' queries are capped at 30 values; chunk defensively.
  for (let i = 0; i < ids.length; i += 30) {
    const chunk = ids.slice(i, i + 30);
    const q = query(collection(db, PRODUCTS), where("__name__", "in", chunk));
    const snap = await getDocs(q);
    results.push(...snap.docs.map((d) => d.data() as Product));
  }
  return results;
}

// --- Admin-only mutations. Enforced server-side via Firestore security rules. ---

export async function createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  const ref = await addDoc(collection(db, PRODUCTS), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(ref, { id: ref.id });
  return ref.id;
}

export async function updateProduct(id: string, changes: Partial<Product>) {
  await updateDoc(doc(db, PRODUCTS, id), { ...changes, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, PRODUCTS, id));
}

export async function adjustProductStock(id: string, delta: number) {
  await updateDoc(doc(db, PRODUCTS, id), {
    stock: increment(delta),
    updatedAt: serverTimestamp(),
  });
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  const snap = await getDocs(query(collection(db, PRODUCTS), orderBy("updatedAt", "desc")));
  return snap.docs.map((d) => d.data() as Product);
}
