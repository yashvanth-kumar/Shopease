"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { getOrdersForUser } from "@/lib/firebase/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-ink-100 text-ink-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-accent-50 text-accent-700",
  out_for_delivery: "bg-accent-50 text-accent-700",
  delivered: "bg-brand-50 text-brand-700",
  cancelled: "bg-red-50 text-red-700",
  refunded: "bg-red-50 text-red-700",
};

function OrderHistoryContent() {
  const { firebaseUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) return;
    getOrdersForUser(firebaseUser.uid)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [firebaseUser]);

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">Order History</h1>

      {loading && <p className="mt-6 text-sm text-ink-500">Loading your orders...</p>}

      {!loading && orders.length === 0 && (
        <div className="mt-10 flex flex-col items-center py-12 text-center">
          <Package size={40} className="text-ink-300" />
          <p className="mt-3 font-medium text-ink-700">You haven&apos;t placed any orders yet</p>
          <Link href="/shop" className="btn-primary mt-4">
            Start Shopping
          </Link>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-ink-500">Order #{order.orderNumber}</p>
                <p className="text-sm text-ink-600">{formatDate(order.createdAt)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
            <div className="mt-3 space-y-1 border-t border-ink-100 pt-3">
              {order.items.slice(0, 3).map((item, i) => (
                <p key={i} className="text-sm text-ink-700">
                  {item.title} × {item.quantity}
                </p>
              ))}
              {order.items.length > 3 && (
                <p className="text-xs text-ink-400">+{order.items.length - 3} more items</p>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
              <span className="font-semibold text-ink-900">{formatCurrency(order.total)}</span>
              {order.trackingNumber && (
                <span className="text-xs text-ink-500">Tracking: {order.trackingNumber}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrderHistoryPage() {
  return (
    <RequireAuth>
      <OrderHistoryContent />
    </RequireAuth>
  );
}
