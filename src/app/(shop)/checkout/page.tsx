"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/context/cartStore";
import { createOrder } from "@/lib/firebase/orders";
import { incrementCouponUsage, findCouponByCode, validateCoupon } from "@/lib/firebase/coupons";
import { formatCurrency, isValidEmail, sanitizeInput } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rateLimit";
import type { Address } from "@/types";

const FREE_SHIPPING_THRESHOLD = 50;
const FLAT_SHIPPING_FEE = 4.99;

export default function CheckoutPage() {
  const router = useRouter();
  const { firebaseUser, profile } = useAuth();
  const { lines, couponCode, subtotal, clearCart } = useCartStore();
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    fullName: profile?.displayName ?? "",
    email: firebaseUser?.email ?? "",
    phone: profile?.phone ?? "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  const cartSubtotal = subtotal();
  const shippingFee = cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartSubtotal === 0 ? 0 : FLAT_SHIPPING_FEE;
  // Discount is re-derived from the coupon here (and again right before order
  // placement) rather than trusted from earlier cart-page state, since the
  // true discount amount must be computed against the current subtotal.
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (!couponCode) {
      setDiscount(0);
      return;
    }
    validateCoupon(couponCode, cartSubtotal).then((result) => {
      if (!cancelled) setDiscount(result.valid ? result.discountAmount ?? 0 : 0);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponCode, cartSubtotal]);
  const total = Math.max(0, cartSubtotal - discount) + shippingFee;

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateForm() {
    if (!form.fullName.trim() || !form.phone.trim() || !form.line1.trim() || !form.city.trim()) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!/^[\d+\-\s()]{7,20}$/.test(form.phone)) {
      toast.error("Please enter a valid phone number.");
      return false;
    }
    return true;
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!validateForm()) return;

    const rate = checkRateLimit("place-order", 5, 60_000);
    if (!rate.allowed) {
      toast.error("Too many order attempts. Please wait a moment.");
      return;
    }

    setPlacing(true);
    try {
      let appliedDiscount = 0;
      let coupon = null;
      if (couponCode) {
        const validation = await validateCoupon(couponCode, cartSubtotal);
        if (!validation.valid) {
          toast.error(validation.reason ?? "Your coupon is no longer valid and was removed.");
          setDiscount(0);
        } else {
          appliedDiscount = validation.discountAmount ?? 0;
          coupon = validation.coupon ?? (await findCouponByCode(couponCode));
        }
      }

      const shippingAddress: Address = {
        id: `addr-${Date.now()}`,
        fullName: sanitizeInput(form.fullName),
        phone: sanitizeInput(form.phone),
        line1: sanitizeInput(form.line1),
        line2: form.line2 ? sanitizeInput(form.line2) : undefined,
        city: sanitizeInput(form.city),
        state: sanitizeInput(form.state),
        postalCode: sanitizeInput(form.postalCode),
        country: form.country,
      };

      const { id, orderNumber } = await createOrder({
        userId: firebaseUser?.uid ?? "guest",
        customerName: shippingAddress.fullName,
        customerEmail: sanitizeInput(form.email),
        customerPhone: shippingAddress.phone,
        items: lines.map((l) => ({
          productId: l.productId,
          variantId: l.variantId,
          title: l.title,
          image: l.image,
          price: l.price,
          quantity: l.quantity,
          sku: l.sku,
        })),
        subtotal: cartSubtotal,
        discount: appliedDiscount,
        shippingFee,
        tax: 0,
        total,
        couponCode: couponCode ?? undefined,
        shippingAddress,
        paymentMethod: "cod",
        paymentStatus: "pending",
        status: "pending",
      });

      if (coupon) {
        await incrementCouponUsage(coupon.id);
      }

      clearCart();
      toast.success(`Order ${orderNumber} placed successfully!`);
      router.push(`/order-success/${id}`);
   } catch (error) {
  console.error("ORDER ERROR:", error);

  if (error instanceof Error) {
    console.error(error.message);
    alert(error.message);
    toast.error(error.message);
  } else {
    console.error(error);
    alert("Unknown error occurred");
    toast.error("Failed to place order. Please try again.");
  }
} finally {
  setPlacing(false);
        }

  if (lines.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900">Your cart is empty</h1>
        <p className="mt-2 text-ink-500">Add some products before checking out.</p>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-5">
            <h2 className="font-display text-lg font-bold text-ink-900">Contact Information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Phone *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-display text-lg font-bold text-ink-900">Shipping Address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="line1" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Address Line 1 *
                </label>
                <input
                  id="line1"
                  value={form.line1}
                  onChange={(e) => updateField("line1", e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="line2" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Address Line 2
                </label>
                <input
                  id="line2"
                  value={form.line2}
                  onChange={(e) => updateField("line2", e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-ink-700">
                  City *
                </label>
                <input
                  id="city"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="state" className="mb-1.5 block text-sm font-medium text-ink-700">
                  State / Province
                </label>
                <input
                  id="state"
                  value={form.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  value={form.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Country
                </label>
                <input
                  id="country"
                  value={form.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-display text-lg font-bold text-ink-900">Payment Method</h2>
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-brand-200 bg-brand-50 p-4">
              <input type="radio" checked readOnly className="h-4 w-4 accent-brand-600" />
              <div>
                <p className="text-sm font-semibold text-ink-900">Cash on Delivery</p>
                <p className="text-xs text-ink-500">Pay with cash when your order arrives.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card sticky top-24 p-5">
            <h2 className="font-display text-lg font-bold text-ink-900">Order Summary</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
              {lines.map((line) => (
                <div key={`${line.productId}-${line.variantId ?? ""}`} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                    <Image src={line.image} alt={line.title} fill sizes="56px" className="object-cover" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink-700 text-[10px] font-bold text-white">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-ink-900">{line.title}</p>
                    <p className="text-xs text-ink-500">{formatCurrency(line.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm">
              <div className="flex justify-between text-ink-600">
                <span>Subtotal</span>
                <span>{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-600">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold text-ink-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button type="submit" disabled={placing} className="btn-primary mt-5 w-full">
              {placing ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
