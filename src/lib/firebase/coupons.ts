import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";
import type { Coupon } from "@/types";

const COUPONS = "coupons";

export interface CouponValidationResult {
  valid: boolean;
  reason?: string;
  coupon?: Coupon;
  discountAmount?: number;
}

export async function findCouponByCode(code: string): Promise<Coupon | null> {
  const q = query(collection(db, COUPONS), where("code", "==", code.toUpperCase().trim()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as Coupon;
}

/**
 * Validates a coupon code against current time, usage limits and order
 * value, then computes the discount. All checks are re-verified here
 * (rather than trusting any client-cached coupon state) since coupon
 * validity is time- and usage-sensitive.
 */
export async function validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
  const coupon = await findCouponByCode(code);
  if (!coupon) return { valid: false, reason: "Coupon code not found." };
  if (!coupon.isActive) return { valid: false, reason: "This coupon is no longer active." };

  const now = Date.now();
  if (now < coupon.startsAt) return { valid: false, reason: "This coupon is not active yet." };
  if (now > coupon.expiresAt) return { valid: false, reason: "This coupon has expired." };
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, reason: "This coupon has reached its usage limit." };
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      reason: `Minimum order value of $${coupon.minOrderValue.toFixed(2)} required.`,
    };
  }

  let discountAmount = 0;
  if (coupon.type === "percentage") {
    discountAmount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
  } else if (coupon.type === "fixed") {
    discountAmount = Math.min(coupon.value, subtotal);
  } else if (coupon.type === "free_shipping") {
    discountAmount = 0; // shipping fee waived separately at checkout
  }

  return { valid: true, coupon, discountAmount: Math.round(discountAmount * 100) / 100 };
}

export async function incrementCouponUsage(couponId: string) {
  await updateDoc(doc(db, COUPONS, couponId), { usedCount: increment(1) });
}

// --- Admin-only mutations ---

export async function getAllCouponsForAdmin(): Promise<Coupon[]> {
  const snap = await getDocs(collection(db, COUPONS));
  return snap.docs.map((d) => d.data() as Coupon);
}

export async function createCoupon(coupon: Omit<Coupon, "id" | "usedCount" | "createdAt">) {
  const ref = await addDoc(collection(db, COUPONS), {
    ...coupon,
    code: coupon.code.toUpperCase().trim(),
    usedCount: 0,
    createdAt: serverTimestamp(),
  });
  await updateDoc(ref, { id: ref.id });
  return ref.id;
}

export async function updateCoupon(id: string, changes: Partial<Coupon>) {
  await updateDoc(doc(db, COUPONS, id), changes);
}

export async function deleteCoupon(id: string) {
  await deleteDoc(doc(db, COUPONS, id));
}
