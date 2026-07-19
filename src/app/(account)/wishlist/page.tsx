"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { productsSeed } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";

function WishlistContent() {
  const { profile } = useAuth();
  const wishlistIds = profile?.wishlist ?? [];
  const products = productsSeed.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">My Wishlist</h1>

      {products.length === 0 ? (
        <div className="mt-10 flex flex-col items-center py-12 text-center">
          <Heart size={40} className="text-ink-300" />
          <p className="mt-3 font-medium text-ink-700">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-ink-500">Save items you love to find them here later.</p>
          <Link href="/shop" className="btn-primary mt-4">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <ProductGrid products={products} />
        </div>
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <RequireAuth>
      <WishlistContent />
    </RequireAuth>
  );
}
