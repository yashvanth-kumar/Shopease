"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import type { Product, ProductVariant } from "@/types";
import { useCartStore } from "@/context/cartStore";

export default function AddToCartPanel({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);

  const stock = selectedVariant?.stock ?? product.stock;
  const price = selectedVariant?.price ?? product.price;
  const outOfStock = stock <= 0;

  function handleAddToCart() {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      title: product.title,
      image: product.images[0],
      price,
      quantity,
      stock,
      sku: selectedVariant?.sku ?? product.sku,
      attributes: selectedVariant?.attributes,
    });
    toast.success("Added to cart");
  }

  // Group variants by attribute name (e.g. "size") for a clean selector UI.
  const variantGroups = product.variants
    ? Array.from(new Set(product.variants.flatMap((v) => Object.keys(v.attributes))))
    : [];

  return (
    <div className="space-y-5">
      {variantGroups.map((attrKey) => (
        <div key={attrKey}>
          <p className="mb-2 text-sm font-semibold capitalize text-ink-900">{attrKey}</p>
          <div className="flex flex-wrap gap-2">
            {product.variants!
              .filter((v, i, arr) => arr.findIndex((x) => x.attributes[attrKey] === v.attributes[attrKey]) === i)
              .map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedVariant?.attributes[attrKey] === v.attributes[attrKey]
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-ink-200 text-ink-700 hover:border-ink-400"
                  }`}
                >
                  {v.attributes[attrKey]}
                </button>
              ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <p className="text-sm font-semibold text-ink-900">Quantity</p>
        <div className="flex items-center rounded-lg border border-ink-200">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 hover:bg-ink-100"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            className="p-2 hover:bg-ink-100"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
        <span className="text-xs text-ink-500">
          {outOfStock ? "Out of stock" : `${stock} available`}
        </span>
      </div>

      <button onClick={handleAddToCart} disabled={outOfStock} className="btn-primary w-full sm:w-auto">
        <ShoppingCart size={18} /> {outOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}
