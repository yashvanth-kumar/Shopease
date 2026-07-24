"use client";

import { useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createProduct, updateProduct } from "@/lib/firebase/products";
import { categoriesSeed, withTimestamps } from "@/data/categories";
import { slugify, sanitizeInput } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductFormModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const categories = withTimestamps(categoriesSeed);
  const isEdit = !!product;

  const [form, setForm] = useState({
    title: product?.title ?? "",
    brand: product?.brand ?? "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    price: product?.price ?? 0,
    compareAtPrice: product?.compareAtPrice ?? 0,
    sku: product?.sku ?? "",
    stock: product?.stock ?? 0,
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    tags: product?.tags.join(", ") ?? "",
    featured: product?.featured ?? false,
    isNew: product?.isNew ?? false,
    isActive: product?.isActive ?? true,
  });
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    const cloudName = "j9ks4gjd";
const uploadPreset = "shopease_upload";

    if (!cloudName || !uploadPreset) {
      toast.error("Image upload is not configured. Please set Cloudinary env variables.");
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading("Uploading...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const data = await response.json();
      const url: string | undefined = data?.secure_url;

      if (!url) {
        throw new Error("No secure_url returned from Cloudinary");
      }

      setImages((prev) => [...prev, url]);
      toast.success("Image uploaded", { id: uploadToast });
    } catch {
      toast.error("Failed to upload image. Please try again.", { id: uploadToast });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim() || !form.sku.trim() || images.length === 0) {
      toast.error("Please fill in title, SKU, and add at least one image.");
      return;
    }
    if (form.price <= 0) {
      toast.error("Price must be greater than zero.");
      return;
    }

    const category = categories.find((c) => c.id === form.categoryId);
    if (!category) {
      toast.error("Please select a valid category.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: sanitizeInput(form.title),
        slug: slugify(form.title),
        brand: sanitizeInput(form.brand),
        categoryId: category.id,
        categorySlug: category.slug,
        description: sanitizeInput(form.description),
        shortDescription: sanitizeInput(form.shortDescription),
        images,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        sku: sanitizeInput(form.sku),
        stock: Number(form.stock),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        rating: product?.rating ?? 0,
        reviewCount: product?.reviewCount ?? 0,
        featured: form.featured,
        isNew: form.isNew,
        isActive: form.isActive,
      };

      if (isEdit && product) {
        await updateProduct(product.id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }
      onSaved();
    } catch {
      toast.error("Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 py-10">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl animate-scaleIn rounded-xl2 bg-white p-6 shadow-popover">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Product Images *</label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={img} className="relative h-20 w-20 overflow-hidden rounded-lg border border-ink-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
                    aria-label="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-ink-300 text-ink-400 hover:border-brand-400 hover:text-brand-600">
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                <span className="text-[10px]">Upload</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Title *</label>
              <input value={form.title} onChange={(e) => updateField("title", e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Brand</label>
              <input value={form.brand} onChange={(e) => updateField("brand", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Category *</label>
              <select value={form.categoryId} onChange={(e) => updateField("categoryId", e.target.value)} className="input-field">
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">SKU *</label>
              <input value={form.sku} onChange={(e) => updateField("sku", e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Stock Quantity *</label>
              <input type="number" min={0} value={form.stock} onChange={(e) => updateField("stock", Number(e.target.value))} className="input-field" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Price ($) *</label>
              <input type="number" min={0} step="0.01" value={form.price} onChange={(e) => updateField("price", Number(e.target.value))} className="input-field" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Compare-at Price ($)</label>
              <input type="number" min={0} step="0.01" value={form.compareAtPrice} onChange={(e) => updateField("compareAtPrice", Number(e.target.value))} className="input-field" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Short Description</label>
            <input value={form.shortDescription} onChange={(e) => updateField("shortDescription", e.target.value)} className="input-field" maxLength={150} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Full Description</label>
            <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} className="input-field min-h-[100px]" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => updateField("tags", e.target.value)} className="input-field" placeholder="wireless, audio, bluetooth" />
          </div>

          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} className="h-4 w-4 rounded accent-brand-600" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" checked={form.isNew} onChange={(e) => updateField("isNew", e.target.checked)} className="h-4 w-4 rounded accent-brand-600" />
              Mark as New
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" checked={form.isActive} onChange={(e) => updateField("isActive", e.target.checked)} className="h-4 w-4 rounded accent-brand-600" />
              Active (visible in store)
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading} className="btn-primary">
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
