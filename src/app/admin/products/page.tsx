"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductFormModal from "@/components/admin/ProductFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getAllProductsForAdmin, deleteProduct } from "@/lib/firebase/products";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await getAllProductsForAdmin();
      setProducts(data);
    } catch {
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } catch {
      toast.error("Failed to delete product.");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Products"
        subtitle={`${products.length} total products`}
        action={
          <button
            onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={16} /> Add Product
          </button>
        }
      />

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, or brand..."
            className="input-field pl-9"
          />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50">
            <tr>
              <th className="px-4 py-3 font-medium text-ink-500">Product</th>
              <th className="px-4 py-3 font-medium text-ink-500">SKU</th>
              <th className="px-4 py-3 font-medium text-ink-500">Price</th>
              <th className="px-4 py-3 font-medium text-ink-500">Stock</th>
              <th className="px-4 py-3 font-medium text-ink-500">Status</th>
              <th className="px-4 py-3 text-right font-medium text-ink-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="py-8 text-center text-ink-400">Loading products...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-ink-400">No products found</td></tr>
            )}
            {filtered.map((product) => (
              <tr key={product.id} className="border-t border-ink-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                      <Image src={product.images[0]} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                    <span className="line-clamp-1 font-medium text-ink-900">{product.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-600">{product.sku}</td>
                <td className="px-4 py-3 text-ink-600">{formatCurrency(product.price)}</td>
                <td className="px-4 py-3">
                  <span className={product.stock === 0 ? "font-medium text-red-600" : product.stock <= 10 ? "font-medium text-accent-600" : "text-ink-600"}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${product.isActive ? "bg-brand-50 text-brand-700" : "bg-ink-100 text-ink-500"}`}>
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setModalOpen(true);
                      }}
                      className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100"
                      aria-label="Edit product"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="rounded-lg p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete product"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            loadProducts();
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
