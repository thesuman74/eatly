// src/stores/admin-product-store.ts
import { ProductTypes } from "@/lib/types/menu-types";
import { create } from "zustand";

interface AdminProductStore {
  products: ProductTypes[];
  setProducts: (products: ProductTypes[]) => void;
  addProduct: (product: ProductTypes) => void;
  deleteProduct: (id: string) => void;
  toggleVisibility: (id: string) => void;
}

export const useAdminProductStore = create<AdminProductStore>((set) => ({
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
}));
