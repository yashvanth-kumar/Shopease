"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/context/recentlyViewedStore";

export default function RecentlyViewedTracker({ productId }: { productId: string }) {
  const addProduct = useRecentlyViewedStore((s) => s.addProduct);

  useEffect(() => {
    addProduct(productId);
  }, [productId, addProduct]);

  return null;
}
