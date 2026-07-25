"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { getProductsByIds } from "@/lib/firebase/products";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductGrid";
import type { Product } from "@/types";

function WishlistContent() {
  const { profile } = useAuth();
  const wishlistIds = profile?.wishlist ?? [];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getProductsByIds(wishlistIds)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlistIds.join(",")]);

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">My Wishlist</h1>

      {loading ? (
        <div className="mt-6">
          <ProductGridSkeleton count={5} />
        </div>
      ) : products.length === 0 ? (
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
