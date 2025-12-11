import { ProductTypes } from "@/lib/types/menu-types";
import { create } from "zustand";

interface userProductStore {
  products: ProductTypes[];
  addProduct: (products: ProductTypes[]) => void;
  removeProduct: (id: string) => void;
}

export const userProductStore = create<userProductStore>((set) => ({
  products: [],
  addProduct: (products) => set({ products }),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),
}));
