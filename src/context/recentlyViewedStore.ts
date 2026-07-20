import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedState {
  productIds: string[];
  addProduct: (id: string) => void;
}

const MAX_ITEMS = 12;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      productIds: [],
      addProduct: (id) => {
        const current = get().productIds.filter((p) => p !== id);
        set({ productIds: [id, ...current].slice(0, MAX_ITEMS) });
      },
    }),
    { name: "shopease-recently-viewed" }
  )
);
