"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import { getOrderById } from "@/lib/firebase/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

export default function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(params.orderId)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [params.orderId]);

  if (loading) {
    return <div className="container-page py-24 text-center text-ink-500">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900">Order Not Found</h1>
        <p className="mt-2 text-ink-500">We couldn&apos;t find details for this order.</p>
        <Link href="/" className="btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
          Order Placed Successfully!
        </h1>
        <p className="mt-2 text-ink-500">
          Thank you for your order. A confirmation has been sent to {order.customerEmail}.
        </p>

        <div className="card mt-8 p-6 text-left">
          <div className="flex items-center justify-between border-b border-ink-100 pb-4">
            <div>
              <p className="text-xs text-ink-500">Order Number</p>
              <p className="font-semibold text-ink-900">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-500">Order Date</p>
              <p className="font-semibold text-ink-900">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Package size={16} className="text-ink-400" />
                <span className="flex-1 text-ink-700">
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium text-ink-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1 border-t border-ink-100 pt-4 text-sm">
            <div className="flex justify-between text-ink-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-brand-700">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-600">
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? "Free" : formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold text-ink-900">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="mt-4 border-t border-ink-100 pt-4 text-sm text-ink-600">
            <p className="font-medium text-ink-900">Shipping to:</p>
            <p>{order.shippingAddress.fullName}</p>
            <p>
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
            </p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>Payment: Cash on Delivery</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/orders" className="btn-primary">
            View My Orders
          </Link>
          <Link href="/shop" className="btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
