import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";
import type { Address, UserProfile, UserRole } from "@/types";

const USERS = "users";

export async function getAllUsersForAdmin(): Promise<UserProfile[]> {
  const q = query(collection(db, USERS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UserProfile);
}

/**
 * Changes a user's role. This must only ever be invoked from the admin
 * panel by an already-authenticated admin — Firestore security rules
 * independently enforce that only admins can write the `role` field, so
 * even if this function were called maliciously from a compromised client,
 * the write would be rejected server-side.
 */
export async function setUserRole(uid: string, role: UserRole) {
  await updateDoc(doc(db, USERS, uid), { role, updatedAt: serverTimestamp() });
}

export async function setUserDisabled(uid: string, disabled: boolean) {
  await updateDoc(doc(db, USERS, uid), { disabled, updatedAt: serverTimestamp() });
}

export async function updateUserProfile(uid: string, changes: Partial<UserProfile>) {
  await updateDoc(doc(db, USERS, uid), { ...changes, updatedAt: serverTimestamp() });
}

export async function addUserAddress(uid: string, address: Address) {
  await updateDoc(doc(db, USERS, uid), {
    addresses: arrayUnion(address),
    updatedAt: serverTimestamp(),
  });
}

export async function removeUserAddress(uid: string, address: Address) {
  await updateDoc(doc(db, USERS, uid), {
    addresses: arrayRemove(address),
    updatedAt: serverTimestamp(),
  });
}

export async function toggleWishlist(uid: string, productId: string, isInWishlist: boolean) {
  await updateDoc(doc(db, USERS, uid), {
    wishlist: isInWishlist ? arrayRemove(productId) : arrayUnion(productId),
    updatedAt: serverTimestamp(),
  });
}
