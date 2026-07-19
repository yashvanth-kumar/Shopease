"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { getAllOrdersForAdmin } from "@/lib/firebase/orders";
import { getAllProductsForAdmin } from "@/lib/firebase/products";
import { getAllUsersForAdmin } from "@/lib/firebase/users";
import { formatCurrency } from "@/lib/utils";
import type { Order, Product, UserProfile } from "@/types";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllOrdersForAdmin(), getAllProductsForAdmin(), getAllUsersForAdmin()])
      .then(([o, p, u]) => {
        setOrders(o);
        setProducts(p);
        setUsers(u);
      })
      .catch(() => {
        // Fail gracefully — dashboard shows zero-state rather than crashing
        // if Firestore isn't reachable (e.g. Firebase not yet configured).
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled" && o.status !== "refunded")
      .reduce((sum, o) => sum + o.total, 0);
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;

    return { totalRevenue, lowStock, outOfStock, pendingOrders };
  }, [orders, products]);

  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500">Overview of your store's performance</p>

      {loading ? (
        <p className="mt-6 text-sm text-ink-500">Loading dashboard...</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} trend="From all completed orders" />
            <StatCard label="Total Orders" value={String(orders.length)} icon={ShoppingBag} trend={`${stats.pendingOrders} pending`} trendPositive={stats.pendingOrders === 0} />
            <StatCard label="Total Customers" value={String(users.filter((u) => u.role === "customer").length)} icon={Users} />
            <StatCard label="Total Products" value={String(products.length)} icon={Package} trend={`${stats.outOfStock} out of stock`} trendPositive={stats.outOfStock === 0} />
          </div>

          {(stats.lowStock > 0 || stats.outOfStock > 0) && (
            <div className="mt-6 flex items-start gap-3 rounded-xl2 border border-accent-200 bg-accent-50 p-4">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-accent-600" />
              <div className="text-sm text-accent-800">
                <p className="font-medium">Inventory attention needed</p>
                <p className="mt-0.5">
                  {stats.outOfStock} product(s) are out of stock and {stats.lowStock} are running low (≤10 units).{" "}
                  <Link href="/admin/products" className="font-semibold underline">
                    Manage inventory
                  </Link>
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="card p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-ink-900">Recent Orders</h2>
                <Link href="/admin/orders" className="text-sm font-semibold text-brand-700 hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 text-ink-500">
                      <th className="pb-2 font-medium">Order</th>
                      <th className="pb-2 font-medium">Customer</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-ink-400">
                          No orders yet
                        </td>
                      </tr>
                    )}
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-ink-50">
                        <td className="py-2.5 font-medium text-ink-900">{order.orderNumber}</td>
                        <td className="py-2.5 text-ink-600">{order.customerName}</td>
                        <td className="py-2.5 capitalize text-ink-600">{order.status.replace(/_/g, " ")}</td>
                        <td className="py-2.5 text-right font-medium text-ink-900">
                          {formatCurrency(order.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="font-display text-lg font-bold text-ink-900">Top Products</h2>
              <div className="mt-4 space-y-3">
                {[...products]
                  .sort((a, b) => b.reviewCount - a.reviewCount)
                  .slice(0, 5)
                  .map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-sm">
                      <span className="line-clamp-1 text-ink-700">{p.title}</span>
                      <span className="shrink-0 font-medium text-ink-900">{formatCurrency(p.price)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
