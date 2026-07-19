"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/context/cartStore";
import { formatCurrency } from "@/lib/utils";
import { validateCoupon } from "@/lib/firebase/coupons";
import { checkRateLimit } from "@/lib/rateLimit";

const FREE_SHIPPING_THRESHOLD = 50;
const FLAT_SHIPPING_FEE = 4.99;

export default function CartPage() {
  const { lines, removeItem, updateQuantity, couponCode, applyCoupon, removeCoupon } =
    useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [applying, setApplying] = useState(false);
  const [discount, setDiscount] = useState(0);

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount) + shippingFee;

  // If a coupon code is already stored (e.g. the shopper applied one, then
  // navigated away and came back), re-validate it against the current
  // subtotal so the displayed discount reflects reality rather than
  // silently showing $0 while the code still appears "applied."
  useEffect(() => {
    let cancelled = false;
    if (!couponCode || lines.length === 0) {
      setDiscount(0);
      return;
    }
    validateCoupon(couponCode, subtotal).then((result) => {
      if (cancelled) return;
      if (result.valid) {
        setDiscount(result.discountAmount ?? 0);
      } else {
        setDiscount(0);
        removeCoupon();
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponCode, subtotal, lines.length]);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;

    const rate = checkRateLimit("coupon-attempt", 8, 60_000);
    if (!rate.allowed) {
      toast.error("Too many attempts. Please wait a moment and try again.");
      return;
    }

    setApplying(true);
    try {
      const result = await validateCoupon(couponInput, subtotal);
      if (!result.valid) {
        toast.error(result.reason ?? "Invalid coupon code.");
        setDiscount(0);
        removeCoupon();
        return;
      }
      setDiscount(result.discountAmount ?? 0);
      applyCoupon(couponInput.toUpperCase().trim());
      toast.success("Coupon applied!");
    } catch {
      toast.error("Could not validate coupon. Please try again.");
    } finally {
      setApplying(false);
    }
  }

  function handleRemoveCoupon() {
    removeCoupon();
    setDiscount(0);
    setCouponInput("");
  }

  if (lines.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900">Your cart is empty</h1>
        <p className="mt-2 text-ink-500">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop" className="btn-primary mt-6">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">Shopping Cart</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {lines.map((line) => (
            <div
              key={`${line.productId}-${line.variantId ?? ""}`}
              className="card flex gap-4 p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-50 sm:h-24 sm:w-24">
                <Image src={line.image} alt={line.title} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-ink-900 sm:text-base">{line.title}</p>
                    {line.attributes && (
                      <p className="mt-0.5 text-xs text-ink-500">
                        {Object.entries(line.attributes).map(([k, v]) => `${k}: ${v}`).join(", ")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(line.productId, line.variantId)}
                    className="h-fit rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-ink-200">
                    <button
                      onClick={() => updateQuantity(line.productId, line.quantity - 1, line.variantId)}
                      className="p-1.5 hover:bg-ink-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{line.quantity}</span>
                    <button
                      onClick={() => updateQuantity(line.productId, line.quantity + 1, line.variantId)}
                      className="p-1.5 hover:bg-ink-100"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <p className="font-semibold text-ink-900">
                    {formatCurrency(line.price * line.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="card sticky top-24 p-5">
            <h2 className="font-display text-lg font-bold text-ink-900">Order Summary</h2>

            <div className="mt-4">
              <label htmlFor="coupon" className="mb-1.5 block text-sm font-medium text-ink-700">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  id="coupon"
                  value={couponCode ?? couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter code"
                  className="input-field"
                  disabled={!!couponCode}
                />
                {couponCode ? (
                  <button onClick={handleRemoveCoupon} className="btn-outline shrink-0">
                    Remove
                  </button>
                ) : (
                  <button onClick={handleApplyCoupon} disabled={applying} className="btn-secondary shrink-0">
                    <Tag size={15} /> Apply
                  </button>
                )}
              </div>
              {couponCode && (
                <p className="mt-1.5 text-xs font-medium text-brand-700">
                  &quot;{couponCode}&quot; applied — {formatCurrency(discount)} off
                </p>
              )}
            </div>

            <div className="mt-5 space-y-2 border-t border-ink-100 pt-4 text-sm">
              <div className="flex justify-between text-ink-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand-700">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-600">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}</span>
              </div>
              {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
                <p className="text-xs text-ink-400">
                  Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                </p>
              )}
              <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold text-ink-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary mt-5 w-full">
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="mt-3 block text-center text-sm text-brand-700 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
