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
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";
import type { Address, UserProfile, UserRole } from "@/types";

const USERS = "users";

export async function getAllUsersForAdmin(): Promise<UserProfile[]> {
  const q = query(collection(db, USERS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UserProfile);
}

export async function setUserRole(uid: string, role: UserRole) {
  await updateDoc(doc(db, USERS, uid), {
    role,
    updatedAt: serverTimestamp(),
  });
}

export async function setUserDisabled(uid: string, disabled: boolean) {
  await updateDoc(doc(db, USERS, uid), {
    disabled,
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserProfile(
  uid: string,
  changes: Partial<UserProfile>
) {
  const ref = doc(db, USERS, uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      ...changes,
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(ref, {
      uid,
      ...changes,
      role: "user",
      wishlist: [],
      addresses: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function addUserAddress(uid: string, address: Address) {
  const ref = doc(db, USERS, uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      role: "user",
      wishlist: [],
      addresses: [address],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  await updateDoc(ref, {
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

export async function toggleWishlist(
  uid: string,
  productId: string,
  isInWishlist: boolean
) {
  const ref = doc(db, USERS, uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      role: "user",
      wishlist: [productId],
      addresses: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  await updateDoc(ref, {
    wishlist: isInWishlist
      ? arrayRemove(productId)
      : arrayUnion(productId),
    updatedAt: serverTimestamp(),
  });
      }
