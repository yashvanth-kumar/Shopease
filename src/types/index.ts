// -----------------------------
// Core domain types for ShopEase
// -----------------------------

export type UserRole = "customer" | "admin" | "manager";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  emailVerified: boolean;
  createdAt: number;
  updatedAt: number;
  addresses?: Address[];
  defaultAddressId?: string;
  wishlist?: string[]; // product IDs
  disabled?: boolean;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentId?: string | null;
  order: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size / Color"
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>; // { size: "M", color: "Red" }
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  brand: string;
  categoryId: string;
  categorySlug: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku: string;
  stock: number;
  variants?: ProductVariant[];
  tags: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  isNew: boolean;
  isActive: boolean;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  seoTitle?: string;
  seoDescription?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "cod" | "card_test";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  productId: string;
  variantId?: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: number;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode?: string;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  trackingNumber?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export type CouponType = "percentage" | "fixed" | "free_shipping";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  perUserLimit?: number;
  startsAt: number;
  expiresAt: number;
  isActive: boolean;
  appliesToCategories?: string[];
  createdAt: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  placement: "hero" | "promo_strip" | "category_top";
  order: number;
  isActive: boolean;
  startsAt?: number;
  endsAt?: number;
}

export interface InventoryLog {
  id: string;
  productId: string;
  variantId?: string;
  change: number;
  reason: "restock" | "sale" | "return" | "adjustment" | "damage";
  note?: string;
  createdAt: number;
  createdBy: string;
}

export interface SiteSettings {
  storeName: string;
  storeTagline: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  flatShippingFee: number;
  taxRate: number;
  socialLinks: { facebook?: string; instagram?: string; twitter?: string; youtube?: string };
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  maintenanceMode: boolean;
}

export interface CartLine {
  productId: string;
  variantId?: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  sku: string;
  attributes?: Record<string, string>;
}
