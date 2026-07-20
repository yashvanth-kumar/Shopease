"use client";

import { useRef, useState } from "react";
import { Download, Upload, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getAllProductsForAdmin, createProduct } from "@/lib/firebase/products";
import { getAllCategories, createCategory } from "@/lib/firebase/categories";
import { getAllCouponsForAdmin, createCoupon } from "@/lib/firebase/coupons";

export default function AdminBackupPage() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [pendingImport, setPendingImport] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setExporting(true);
    try {
      const [products, categories, coupons] = await Promise.all([
        getAllProductsForAdmin(),
        getAllCategories(),
        getAllCouponsForAdmin(),
      ]);

      const backup = {
        exportedAt: new Date().toISOString(),
        version: 1,
        data: { products, categories, coupons },
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `shopease-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded successfully");
    } catch {
      toast.error("Failed to create backup.");
    } finally {
      setExporting(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPendingImport(file);
  }

  async function handleConfirmImport() {
    if (!pendingImport) return;
    setImporting(true);
    try {
      const text = await pendingImport.text();
      const backup = JSON.parse(text);

      if (!backup?.data) {
        throw new Error("Invalid backup file format");
      }

      let imported = 0;
      if (Array.isArray(backup.data.categories)) {
        for (const cat of backup.data.categories) {
                    const { id, createdAt, updatedAt, ...rest } = cat;
          await createCategory(rest);
          imported++;
        }
      }
      if (Array.isArray(backup.data.products)) {
        for (const product of backup.data.products) {
                    const { id, createdAt, updatedAt, ...rest } = product;
          await createProduct(rest);
          imported++;
        }
      }
      if (Array.isArray(backup.data.coupons)) {
        for (const coupon of backup.data.coupons) {
                    const { id, usedCount, createdAt, ...rest } = coupon;
          await createCoupon(rest);
          imported++;
        }
      }

      toast.success(`Restored ${imported} records from backup`);
    } catch {
      toast.error("Failed to restore backup. Please check the file format.");
    } finally {
      setImporting(false);
      setPendingImport(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <AdminPageHeader title="Backup & Restore" subtitle="Export your store data or restore from a previous backup" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-ink-900">Export Backup</h2>
          <p className="mt-2 text-sm text-ink-500">
            Download a complete JSON backup of your products, categories, and coupons. Keep this
            file somewhere safe — it can be used to restore your store if needed.
          </p>
          <button onClick={handleExport} disabled={exporting} className="btn-primary mt-4">
            <Download size={16} /> {exporting ? "Preparing..." : "Download Backup"}
          </button>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-ink-900">Restore from Backup</h2>
          <p className="mt-2 text-sm text-ink-500">
            Upload a previously exported backup file to restore products, categories, and coupons.
            This adds new records rather than overwriting existing ones.
          </p>
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-accent-50 p-3 text-xs text-accent-800">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            Restoring creates new records and does not delete existing data. Review your catalog
            after import to remove any unwanted duplicates.
          </div>
          <label className="btn-outline mt-4 inline-flex cursor-pointer">
            <Upload size={16} /> Choose Backup File
            <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileSelect} className="hidden" />
          </label>
        </div>
      </div>

      {pendingImport && (
        <ConfirmDialog
          title="Restore Backup"
          message={`Import data from "${pendingImport.name}"? This will add records to your live store.`}
          confirmLabel={importing ? "Importing..." : "Restore"}
          danger
          onCancel={() => setPendingImport(null)}
          onConfirm={handleConfirmImport}
        />
      )}
    </div>
  );
}
