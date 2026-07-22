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
        toast.error(validation.reason ?? "Coupon is invalid.");
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
      toast.error("Failed to place order.");
    }

  } finally {
    setPlacing(false);
  }
      }
