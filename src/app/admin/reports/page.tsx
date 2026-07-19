"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getAllOrdersForAdmin } from "@/lib/firebase/orders";
import { getAllProductsForAdmin } from "@/lib/firebase/products";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order, Product } from "@/types";

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllOrdersForAdmin(), getAllProductsForAdmin()])
      .then(([o, p]) => {
        setOrders(o);
        setProducts(p);
      })
      .catch(() => toast.error("Failed to load report data."))
      .finally(() => setLoading(false));
  }, []);

  function exportSalesReport() {
    const rows = [
      ["Order Number", "Date", "Customer", "Status", "Subtotal", "Discount", "Shipping", "Total"],
      ...orders.map((o) => [
        o.orderNumber,
        formatDate(o.createdAt),
        o.customerName,
        o.status,
        o.subtotal.toFixed(2),
        o.discount.toFixed(2),
        o.shippingFee.toFixed(2),
        o.total.toFixed(2),
      ]),
    ];
    downloadCsv("shopease-sales-report.csv", rows);
    toast.success("Sales report downloaded");
  }

  function exportInventoryReport() {
    const rows = [
      ["SKU", "Title", "Brand", "Category", "Price", "Stock", "Status"],
      ...products.map((p) => [
        p.sku,
        p.title,
        p.brand,
        p.categorySlug,
        p.price.toFixed(2),
        String(p.stock),
        p.isActive ? "Active" : "Inactive",
      ]),
    ];
    downloadCsv("shopease-inventory-report.csv", rows);
    toast.success("Inventory report downloaded");
  }

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled" && o.status !== "refunded")
    .reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div>
      <AdminPageHeader title="Reports" subtitle="Export and review store performance data" />

      {loading ? (
        <p className="text-sm text-ink-500">Loading report data...</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <p className="text-sm text-ink-500">Total Revenue</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="card p-5">
              <p className="text-sm text-ink-500">Average Order Value</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink-900">{formatCurrency(avgOrderValue)}</p>
            </div>
            <div className="card p-5">
              <p className="text-sm text-ink-500">Inventory Value</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink-900">{formatCurrency(totalInventoryValue)}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <h2 className="font-display text-lg font-bold text-ink-900">Sales Report</h2>
              <p className="mt-1 text-sm text-ink-500">Export all orders with totals and statuses as CSV.</p>
              <button onClick={exportSalesReport} className="btn-outline mt-4">
                <Download size={15} /> Export Sales CSV
              </button>
            </div>
            <div className="card p-5">
              <h2 className="font-display text-lg font-bold text-ink-900">Inventory Report</h2>
              <p className="mt-1 text-sm text-ink-500">Export current stock levels and pricing as CSV.</p>
              <button onClick={exportInventoryReport} className="btn-outline mt-4">
                <Download size={15} /> Export Inventory CSV
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
