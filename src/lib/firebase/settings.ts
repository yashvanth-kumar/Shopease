import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";
import type { SiteSettings } from "@/types";

const SETTINGS_DOC = "settings/site";

export const DEFAULT_SETTINGS: SiteSettings = {
  storeName: "ShopEase",
  storeTagline: "Everything you need, delivered fast.",
  supportEmail: "support@shopease-demo.com",
  supportPhone: "+1 (800) 555-0199",
  address: "500 Market Street, Suite 200, San Francisco, CA 94105",
  currency: "USD",
  currencySymbol: "$",
  freeShippingThreshold: 50,
  flatShippingFee: 4.99,
  taxRate: 0.0,
  socialLinks: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
  },
  seoDefaultTitle: "ShopEase — Shop Electronics, Fashion, Home & More Online",
  seoDefaultDescription:
    "Discover quality products across electronics, fashion, home, beauty, and more. Fast shipping, secure checkout, and easy returns at ShopEase.",
  maintenanceMode: false,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const snap = await getDoc(doc(db, SETTINGS_DOC));
  if (!snap.exists()) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(snap.data() as Partial<SiteSettings>) };
}

export async function updateSiteSettings(changes: Partial<SiteSettings>) {
  await setDoc(doc(db, SETTINGS_DOC), changes, { merge: true });
}
