"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSiteSettings, updateSiteSettings, DEFAULT_SETTINGS } from "@/lib/firebase/settings";
import type { SiteSettings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-500">Loading settings...</p>;

  return (
    <div>
      <AdminPageHeader title="Website Settings" subtitle="Configure store details, shipping, and SEO defaults" />

      <div className="space-y-6">
        <div className="card p-5">
          <h2 className="font-display text-lg font-bold text-ink-900">General</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Store Name</label>
              <input value={settings.storeName} onChange={(e) => update("storeName", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Store Tagline</label>
              <input value={settings.storeTagline} onChange={(e) => update("storeTagline", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Support Email</label>
              <input value={settings.supportEmail} onChange={(e) => update("supportEmail", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Support Phone</label>
              <input value={settings.supportPhone} onChange={(e) => update("supportPhone", e.target.value)} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Store Address</label>
              <input value={settings.address} onChange={(e) => update("address", e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-display text-lg font-bold text-ink-900">Shipping &amp; Tax</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Free Shipping Threshold ($)</label>
              <input type="number" value={settings.freeShippingThreshold} onChange={(e) => update("freeShippingThreshold", Number(e.target.value))} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Flat Shipping Fee ($)</label>
              <input type="number" value={settings.flatShippingFee} onChange={(e) => update("flatShippingFee", Number(e.target.value))} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Tax Rate (%)</label>
              <input type="number" value={settings.taxRate * 100} onChange={(e) => update("taxRate", Number(e.target.value) / 100)} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-display text-lg font-bold text-ink-900">SEO Defaults</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Default Meta Title</label>
              <input value={settings.seoDefaultTitle} onChange={(e) => update("seoDefaultTitle", e.target.value)} className="input-field" maxLength={60} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Default Meta Description</label>
              <textarea value={settings.seoDefaultDescription} onChange={(e) => update("seoDefaultDescription", e.target.value)} className="input-field" maxLength={160} />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-display text-lg font-bold text-ink-900">Maintenance Mode</h2>
          <label className="mt-3 flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => update("maintenanceMode", e.target.checked)} className="h-4 w-4 rounded accent-brand-600" />
            Enable maintenance mode (hides storefront from customers)
          </label>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
