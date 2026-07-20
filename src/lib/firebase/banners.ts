import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";
import type { Banner } from "@/types";

const BANNERS = "banners";

export async function getActiveBanners(placement: Banner["placement"]): Promise<Banner[]> {
  const q = query(
    collection(db, BANNERS),
    where("placement", "==", placement),
    where("isActive", "==", true),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  const now = Date.now();
  return snap.docs
    .map((d) => d.data() as Banner)
    .filter((b) => (!b.startsAt || b.startsAt <= now) && (!b.endsAt || b.endsAt >= now));
}

export async function getAllBannersForAdmin(): Promise<Banner[]> {
  const snap = await getDocs(query(collection(db, BANNERS), orderBy("order", "asc")));
  return snap.docs.map((d) => d.data() as Banner);
}

export async function createBanner(banner: Omit<Banner, "id">) {
  const ref = await addDoc(collection(db, BANNERS), banner);
  await updateDoc(ref, { id: ref.id });
  return ref.id;
}

export async function updateBanner(id: string, changes: Partial<Banner>) {
  await updateDoc(doc(db, BANNERS, id), changes);
}

export async function deleteBanner(id: string) {
  await deleteDoc(doc(db, BANNERS, id));
}
