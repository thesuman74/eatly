// stores/useProductStore.ts
import { ProductCategoryTypes, ProductTypes } from "@/lib/types/menu-types";
import { create } from "zustand";

interface ProductStore {
  categories: ProductCategoryTypes[];
  setCategories: (categories: ProductCategoryTypes[]) => void;
  addProduct: (categoryId: string, product: ProductTypes) => void;
  getProducts: () => ProductTypes[];

  // cart-related
  cart: ProductTypes[];
  addToCart: (product: ProductTypes) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  categories: [],

  setCategories: (categories) => set({ categories }),

  addProduct: (categoryId, product) => {
    const updatedCategories = get().categories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, products: [...cat.products, product] }
        : cat
    );
    set({ categories: updatedCategories });
  },

  getProducts: () => {
    return get().categories.flatMap((cat) => cat.products);
  },

  // cart-related logic
  cart: [],
  addToCart: (product) => {
    const existing = get().cart.find((item) => item.id === product.id);
    if (!existing) {
      set((state) => ({
        cart: [...state.cart, product],
      }));
    }
  },
  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));
  },
  clearCart: () => set({ cart: [] }),

  get total() {
    return get().cart.reduce((acc, item) => acc + item.price, 0);
  },
}));
