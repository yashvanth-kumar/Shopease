"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/firebase/categories";
import { slugify, sanitizeInput } from "@/lib/utils";
import type { Category } from "@/types";

function CategoryFormModal({
  category,
  onClose,
  onSaved,
}: {
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: category?.name ?? "",
    description: category?.description ?? "",
    imageUrl: category?.imageUrl ?? "",
    order: category?.order ?? 1,
    featured: category?.featured ?? false,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.imageUrl.trim()) {
      toast.error("Please fill in name and image URL.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: sanitizeInput(form.name),
        slug: slugify(form.name),
        description: sanitizeInput(form.description),
        imageUrl: form.imageUrl.trim(),
        parentId: null,
        order: Number(form.order),
        featured: form.featured,
      };
      if (category) {
        await updateCategory(category.id, payload);
        toast.success("Category updated");
      } else {
        await createCategory(payload);
        toast.success("Category created");
      }
      onSaved();
    } catch {
      toast.error("Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-scaleIn rounded-xl2 bg-white p-6 shadow-popover">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900">
            {category ? "Edit Category" : "Add Category"}
          </h2>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Image URL *</label>
            <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className="input-field" />
            </div>
            <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-ink-700">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="h-4 w-4 rounded accent-brand-600" />
              Featured on homepage
            </label>
          </div>
          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  async function load() {
    setLoading(true);
    try {
      setCategories(await getAllCategories());
    } catch {
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    } catch {
      toast.error("Failed to delete category.");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        subtitle={`${categories.length} categories`}
        action={
          <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary">
            <Plus size={16} /> Add Category
          </button>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-500">Loading categories...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="card overflow-hidden">
              <div className="relative aspect-[16/9]">
                <Image src={c.imageUrl} alt={c.name} fill sizes="400px" className="object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-ink-900">{c.name}</h3>
                  {c.featured && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">Featured</span>}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-ink-500">{c.description}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => { setEditing(c); setModalOpen(true); }} className="btn-outline flex-1 !py-1.5 text-xs">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(c)} className="btn-outline !py-1.5 text-xs text-red-600 hover:bg-red-50">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <CategoryFormModal category={editing} onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); load(); }} />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Category"
          message={`Delete "${deleteTarget.name}"? Products in this category will remain but lose their category link.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
