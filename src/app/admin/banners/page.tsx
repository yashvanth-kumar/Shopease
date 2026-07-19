"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getAllBannersForAdmin, createBanner, updateBanner, deleteBanner } from "@/lib/firebase/banners";
import type { Banner } from "@/types";

function BannerFormModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    placement: "hero" as Banner["placement"],
    order: 1,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.imageUrl.trim()) {
      toast.error("Please fill in title and image URL.");
      return;
    }
    setSaving(true);
    try {
      await createBanner({ ...form, isActive: true });
      toast.success("Banner created");
      onSaved();
    } catch {
      toast.error("Failed to create banner.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-scaleIn rounded-xl2 bg-white p-6 shadow-popover">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900">Add Banner</h2>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Title *</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input-field" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Subtitle</label>
            <input value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Image URL *</label>
            <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">CTA Text</label>
              <input value={form.ctaText} onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">CTA Link</label>
              <input value={form.ctaLink} onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))} className="input-field" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Placement</label>
            <select value={form.placement} onChange={(e) => setForm((f) => ({ ...f, placement: e.target.value as Banner["placement"] }))} className="input-field">
              <option value="hero">Homepage Hero</option>
              <option value="promo_strip">Promo Strip</option>
              <option value="category_top">Category Page Top</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Create Banner"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

  async function load() {
    setLoading(true);
    try {
      setBanners(await getAllBannersForAdmin());
    } catch {
      toast.error("Failed to load banners.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleToggleActive(banner: Banner) {
    try {
      await updateBanner(banner.id, { isActive: !banner.isActive });
      load();
    } catch {
      toast.error("Failed to update banner.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteBanner(deleteTarget.id);
      toast.success("Banner deleted");
      setBanners((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    } catch {
      toast.error("Failed to delete banner.");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Banners"
        subtitle={`${banners.length} banners`}
        action={
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={16} /> Add Banner
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-sm text-ink-500">Loading banners...</p>}
        {!loading && banners.length === 0 && <p className="text-sm text-ink-500">No banners yet.</p>}
        {banners.map((b) => (
          <div key={b.id} className="card overflow-hidden">
            <div className="relative aspect-[16/9] bg-ink-100">
              <Image src={b.imageUrl} alt={b.title} fill sizes="400px" className="object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-ink-900">{b.title}</h3>
                <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs capitalize text-ink-600">{b.placement.replace("_", " ")}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleToggleActive(b)} className={`btn-outline flex-1 !py-1.5 text-xs ${b.isActive ? "" : "opacity-60"}`}>
                  {b.isActive ? "Active" : "Inactive"}
                </button>
                <button onClick={() => setDeleteTarget(b)} className="btn-outline !py-1.5 text-xs text-red-600 hover:bg-red-50">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && <BannerFormModal onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); load(); }} />}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Banner"
          message={`Delete banner "${deleteTarget.title}"?`}
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
