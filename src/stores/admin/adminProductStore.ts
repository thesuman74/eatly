// src/stores/adminProductStore.ts
import { ProductTypes } from "@/lib/types/menu-types";
import { create } from "zustand";

interface AdminProductStore {
  products: ProductTypes[];
  setProducts: (products: ProductTypes[]) => void;
  addProduct: (product: ProductTypes) => void;
  deleteProduct: (id: string) => void;
  toggleVisibility: (id: string) => void;
  deleteProductAsync: (productId: string) => Promise<void>;
}

export const useAdminProductStore = create<AdminProductStore>((set, get) => ({
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  deleteProduct: (id) =>
    set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
  toggleVisibility: (id) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, isVisible: !p.isVisible } : p
      ),
    })),
  deleteProductAsync: async (productId: string) => {
    try {
      const res = await fetch(`/api/menu/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      // Update Zustand store after backend succeeds
      get().deleteProduct(productId);
    } catch (err) {
      console.error(err);
      // Optionally: toast error here
    }
  },
}));
