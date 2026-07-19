"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types";
import StarRating from "@/components/ui/StarRating";
import { calculateDiscountPercent, cn, formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toggleWishlist } from "@/lib/firebase/users";
import toast from "react-hot-toast";

export default function ProductCard({ product }: { product: Product }) {
  const { firebaseUser, profile, refreshProfile } = useAuth();
  const [isToggling, setIsToggling] = useState(false);
  const isWishlisted = profile?.wishlist?.includes(product.id) ?? false;
  const discount = calculateDiscountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;

  async function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!firebaseUser) {
      toast.error("Please sign in to save items to your wishlist");
      return;
    }
    setIsToggling(true);
    try {
      await toggleWishlist(firebaseUser.uid, product.id, isWishlisted);
      await refreshProfile();
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="card group block overflow-hidden hover:shadow-card-hover"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-50">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.isNew && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white peer-[]:top-8">
            New
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold text-ink-700">
            Out of Stock
          </span>
        )}
        <button
          onClick={handleWishlistToggle}
          disabled={isToggling}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm transition-transform hover:scale-110"
        >
          <Heart
            size={16}
            className={cn(isWishlisted ? "fill-red-500 text-red-500" : "text-ink-500")}
          />
        </button>
      </div>

      <div className="p-3">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-ink-400">
          {product.brand}
        </p>
        <h3 className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-ink-900">
          {product.title}
        </h3>
        <div className="mt-1.5">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} size={12} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-ink-900">{formatCurrency(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-ink-400 line-through">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
