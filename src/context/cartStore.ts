import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types";

interface CartState {
  lines: CartLine[];
  couponCode: string | null;
  addItem: (line: CartLine) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

function sameLine(a: CartLine, productId: string, variantId?: string) {
  return a.productId === productId && a.variantId === variantId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      couponCode: null,

      addItem: (line) => {
        set((state) => {
          const existingIndex = state.lines.findIndex((l) =>
            sameLine(l, line.productId, line.variantId)
          );
          if (existingIndex >= 0) {
            const updated = [...state.lines];
            const newQty = Math.min(
              updated[existingIndex].quantity + line.quantity,
              line.stock
            );
            updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
            return { lines: updated };
          }
          return { lines: [...state.lines, line] };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          lines: state.lines.filter((l) => !sameLine(l, productId, variantId)),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        set((state) => ({
          lines: state.lines.map((l) =>
            sameLine(l, productId, variantId)
              ? { ...l, quantity: Math.max(1, Math.min(quantity, l.stock)) }
              : l
          ),
        }));
      },

      clearCart: () => set({ lines: [], couponCode: null }),

      applyCoupon: (code) => set({ couponCode: code }),
      removeCoupon: () => set({ couponCode: null }),

      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      itemCount: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    {
      name: "shopease-cart",
    }
  )
);
