"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getAllOrdersForAdmin, updateOrderStatus, updateTrackingNumber } from "@/lib/firebase/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "refunded",
];

function OrderDetailModal({ order, onClose, onUpdated }: { order: Order; onClose: () => void; onUpdated: () => void }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [tracking, setTracking] = useState(order.trackingNumber ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      if (status !== order.status) {
        await updateOrderStatus(order.id, status);
      }
      if (tracking !== (order.trackingNumber ?? "")) {
        await updateTrackingNumber(order.id, tracking);
      }
      toast.success("Order updated");
      onUpdated();
    } catch {
      toast.error("Failed to update order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 py-10">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-scaleIn rounded-xl2 bg-white p-6 shadow-popover">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900">Order {order.orderNumber}</h2>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1 text-sm">
          <div>
            <p className="font-semibold text-ink-900">Customer</p>
            <p className="text-ink-600">{order.customerName} — {order.customerEmail}</p>
            <p className="text-ink-600">{order.customerPhone}</p>
          </div>
          <div>
            <p className="font-semibold text-ink-900">Shipping Address</p>
            <p className="text-ink-600">
              {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink-900">Items</p>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-ink-600">
                <span>{item.title} × {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-ink-100 pt-3 font-semibold text-ink-900">
            Total: {formatCurrency(order.total)}
          </div>

          <div>
            <label className="mb-1.5 block font-medium text-ink-700">Order Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="input-field">
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block font-medium text-ink-700">Tracking Number</label>
            <input value={tracking} onChange={(e) => setTracking(e.target.value)} className="input-field" placeholder="e.g. 1Z999AA10123456784" />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-ink-100 pt-4">
          <button onClick={onClose} className="btn-secondary">Close</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Order | null>(null);

  async function load() {
    setLoading(true);
    try {
      setOrders(await getAllOrdersForAdmin());
    } catch {
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <AdminPageHeader title="Orders" subtitle={`${orders.length} total orders`} />

      <div className="mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50">
            <tr>
              <th className="px-4 py-3 font-medium text-ink-500">Order</th>
              <th className="px-4 py-3 font-medium text-ink-500">Customer</th>
              <th className="px-4 py-3 font-medium text-ink-500">Date</th>
              <th className="px-4 py-3 font-medium text-ink-500">Status</th>
              <th className="px-4 py-3 text-right font-medium text-ink-500">Total</th>
              <th className="px-4 py-3 text-right font-medium text-ink-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="py-8 text-center text-ink-400">Loading orders...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-ink-400">No orders found</td></tr>}
            {filtered.map((order) => (
              <tr key={order.id} className="border-t border-ink-100">
                <td className="px-4 py-3 font-medium text-ink-900">{order.orderNumber}</td>
                <td className="px-4 py-3 text-ink-600">{order.customerName}</td>
                <td className="px-4 py-3 text-ink-600">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3 capitalize text-ink-600">{order.status.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 text-right font-medium text-ink-900">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setSelected(order)} className="text-sm font-semibold text-brand-700 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <OrderDetailModal order={selected} onClose={() => setSelected(null)} onUpdated={() => { setSelected(null); load(); }} />
      )}
    </div>
  );
}
