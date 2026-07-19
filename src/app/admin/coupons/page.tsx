"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  getAllCouponsForAdmin,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/lib/firebase/coupons";
import { formatDate } from "@/lib/utils";
import type { Coupon, CouponType } from "@/types";

function CouponFormModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    code: "",
    type: "percentage" as CouponType,
    value: 10,
    minOrderValue: 0,
    maxDiscount: 0,
    usageLimit: 100,
    days: 30,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }
    setSaving(true);
    try {
      const now = Date.now();
      await createCoupon({
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrderValue: form.minOrderValue || undefined,
        maxDiscount: form.maxDiscount || undefined,
        usageLimit: form.usageLimit || undefined,
        perUserLimit: 1,
        startsAt: now,
        expiresAt: now + form.days * 86_400_000,
        isActive: true,
      });
      toast.success("Coupon created");
      onSaved();
    } catch {
      toast.error("Failed to create coupon.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md animate-scaleIn rounded-xl2 bg-white p-6 shadow-popover">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900">Create Coupon</h2>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Coupon Code *</label>
            <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className="input-field" placeholder="SAVE20" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CouponType }))} className="input-field">
                <option value="percentage">Percentage Off</option>
                <option value="fixed">Fixed Amount Off</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Value {form.type === "percentage" ? "(%)" : "($)"}
              </label>
              <input type="number" min={0} value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))} className="input-field" disabled={form.type === "free_shipping"} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Min Order Value ($)</label>
              <input type="number" min={0} value={form.minOrderValue} onChange={(e) => setForm((f) => ({ ...f, minOrderValue: Number(e.target.value) }))} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Max Discount ($)</label>
              <input type="number" min={0} value={form.maxDiscount} onChange={(e) => setForm((f) => ({ ...f, maxDiscount: Number(e.target.value) }))} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Usage Limit</label>
              <input type="number" min={0} value={form.usageLimit} onChange={(e) => setForm((f) => ({ ...f, usageLimit: Number(e.target.value) }))} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Valid for (days)</label>
              <input type="number" min={1} value={form.days} onChange={(e) => setForm((f) => ({ ...f, days: Number(e.target.value) }))} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Creating..." : "Create Coupon"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  async function load() {
    setLoading(true);
    try {
      setCoupons(await getAllCouponsForAdmin());
    } catch {
      toast.error("Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleToggleActive(coupon: Coupon) {
    try {
      await updateCoupon(coupon.id, { isActive: !coupon.isActive });
      toast.success(coupon.isActive ? "Coupon deactivated" : "Coupon activated");
      load();
    } catch {
      toast.error("Failed to update coupon.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCoupon(deleteTarget.id);
      toast.success("Coupon deleted");
      setCoupons((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    } catch {
      toast.error("Failed to delete coupon.");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Coupons"
        subtitle={`${coupons.length} coupons`}
        action={
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={16} /> Create Coupon
          </button>
        }
      />

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50">
            <tr>
              <th className="px-4 py-3 font-medium text-ink-500">Code</th>
              <th className="px-4 py-3 font-medium text-ink-500">Type</th>
              <th className="px-4 py-3 font-medium text-ink-500">Value</th>
              <th className="px-4 py-3 font-medium text-ink-500">Used</th>
              <th className="px-4 py-3 font-medium text-ink-500">Expires</th>
              <th className="px-4 py-3 font-medium text-ink-500">Status</th>
              <th className="px-4 py-3 text-right font-medium text-ink-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="py-8 text-center text-ink-400">Loading coupons...</td></tr>}
            {!loading && coupons.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-ink-400">No coupons yet</td></tr>}
            {coupons.map((c) => (
              <tr key={c.id} className="border-t border-ink-100">
                <td className="px-4 py-3 font-mono font-medium text-ink-900">{c.code}</td>
                <td className="px-4 py-3 capitalize text-ink-600">{c.type.replace("_", " ")}</td>
                <td className="px-4 py-3 text-ink-600">
                  {c.type === "percentage" ? `${c.value}%` : c.type === "fixed" ? `$${c.value}` : "—"}
                </td>
                <td className="px-4 py-3 text-ink-600">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                <td className="px-4 py-3 text-ink-600">{formatDate(c.expiresAt)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggleActive(c)} className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.isActive ? "bg-brand-50 text-brand-700" : "bg-ink-100 text-ink-500"}`}>
                    {c.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setDeleteTarget(c)} className="rounded-lg p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete coupon">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && <CouponFormModal onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); load(); }} />}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Coupon"
          message={`Delete coupon "${deleteTarget.code}"? This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
