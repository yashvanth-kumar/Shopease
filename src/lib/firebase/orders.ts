import {
  addDoc,
  collection,
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
import { adjustProductStock } from "./products";
import type { Order, OrderStatus } from "@/types";

const ORDERS = "orders";

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SE-${ts}-${rand}`;
}

export async function createOrder(
  order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt" | "statusHistory">
) {
  const orderNumber = generateOrderNumber();
  const now = Date.now();
  const ref = await addDoc(collection(db, ORDERS), {
    ...order,
    orderNumber,
    statusHistory: [{ status: order.status, timestamp: now, note: "Order placed" }],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(ref, { id: ref.id });

  // Decrement stock for each purchased line item.
  await Promise.all(
    order.items.map((item) => adjustProductStock(item.productId, -item.quantity))
  );

  return { id: ref.id, orderNumber };
}

export async function getOrderById(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, ORDERS, id));
  if (!snap.exists()) return null;
  return snap.data() as Order;
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const q = query(collection(db, ORDERS), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Order);
}

export async function getAllOrdersForAdmin(): Promise<Order[]> {
  const q = query(collection(db, ORDERS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Order);
}

export async function updateOrderStatus(id: string, status: OrderStatus, note?: string) {
  const orderSnap = await getDoc(doc(db, ORDERS, id));
  if (!orderSnap.exists()) throw new Error("Order not found");
  const existing = orderSnap.data() as Order;
  const event = { status, timestamp: Date.now(), note: note ?? "" };
  await updateDoc(doc(db, ORDERS, id), {
    status,
    statusHistory: [...existing.statusHistory, event],
    updatedAt: serverTimestamp(),
  });
}

export async function updateTrackingNumber(id: string, trackingNumber: string) {
  await updateDoc(doc(db, ORDERS, id), { trackingNumber, updatedAt: serverTimestamp() });
}
