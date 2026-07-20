import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";
import { updateProduct } from "./products";
import type { Review } from "@/types";

const REVIEWS = "reviews";

export async function getApprovedReviewsForProduct(productId: string): Promise<Review[]> {
  const q = query(
    collection(db, REVIEWS),
    where("productId", "==", productId),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Review);
}

export async function getPendingReviewsForAdmin(): Promise<Review[]> {
  const q = query(collection(db, REVIEWS), where("status", "==", "pending"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Review);
}

export async function getAllReviewsForAdmin(): Promise<Review[]> {
  const q = query(collection(db, REVIEWS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Review);
}

/**
 * Submits a new review. Reviews start in "pending" status and only become
 * publicly visible once approved by an admin/moderator, which prevents
 * unmoderated content (spam, abuse) from appearing on live product pages.
 */
export async function submitReview(review: Omit<Review, "id" | "createdAt" | "status" | "helpful">) {
  const ref = await addDoc(collection(db, REVIEWS), {
    ...review,
    status: "pending",
    helpful: 0,
    createdAt: serverTimestamp(),
  });
  await updateDoc(ref, { id: ref.id });
  return ref.id;
}

export async function moderateReview(
  reviewId: string,
  productId: string,
  decision: "approved" | "rejected"
) {
  await updateDoc(doc(db, REVIEWS, reviewId), { status: decision });

  if (decision === "approved") {
    // Recompute aggregate rating/count on the product for display purposes.
    const approved = await getApprovedReviewsForProduct(productId);
    const avg = approved.length
      ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
      : 0;
    await updateProduct(productId, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: approved.length,
    });
  }
}

export async function deleteReview(reviewId: string) {
  await deleteDoc(doc(db, REVIEWS, reviewId));
}

export async function markReviewHelpful(reviewId: string) {
  await updateDoc(doc(db, REVIEWS, reviewId), { helpful: increment(1) });
}
