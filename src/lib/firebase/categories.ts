import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";
import type { Category } from "@/types";

const CATEGORIES = "categories";

export async function getAllCategories(): Promise<Category[]> {
  const snap = await getDocs(query(collection(db, CATEGORIES), orderBy("order", "asc")));
  return snap.docs.map((d) => d.data() as Category);
}

export async function getFeaturedCategories(): Promise<Category[]> {
  const q = query(
    collection(db, CATEGORIES),
    where("featured", "==", true),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Category);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const q = query(collection(db, CATEGORIES), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as Category;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const snap = await getDoc(doc(db, CATEGORIES, id));
  if (!snap.exists()) return null;
  return snap.data() as Category;
}

// --- Admin-only mutations ---

export async function createCategory(category: Omit<Category, "id" | "createdAt" | "updatedAt">) {
  const ref = await addDoc(collection(db, CATEGORIES), {
    ...category,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(ref, { id: ref.id });
  return ref.id;
}

export async function updateCategory(id: string, changes: Partial<Category>) {
  await updateDoc(doc(db, CATEGORIES, id), { ...changes, updatedAt: serverTimestamp() });
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, CATEGORIES, id));
}
