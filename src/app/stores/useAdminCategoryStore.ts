import { ProductCategoryTypes } from "@/lib/types/menu-types";
import { toast } from "react-toastify";
import { create } from "zustand";

interface AdminCategoryStore {
  categories: ProductCategoryTypes[];
  setCategories: (categories: ProductCategoryTypes[]) => void;
  addCategory: (category: ProductCategoryTypes) => void;
  updateCategory: (category: ProductCategoryTypes) => void;
  toggleCategoryVisibility: (id: string) => void;
  deleteCategory: (id: string) => void;
}

export const useAdminCategoryStore = create<AdminCategoryStore>((set, get) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (category) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === category.id ? category : c
      ),
    })),
  toggleCategoryVisibility: (id) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, isVisible: !cat.isVisible } : cat
      ),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
}));
