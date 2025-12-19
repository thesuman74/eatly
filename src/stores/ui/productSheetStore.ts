import { create } from "zustand";

interface ProductSheetState {
  isOpen: boolean;
  productId: string | null; // ✅ Changed: Only store ID
  categoryId: string | null;
  mode: "add" | "edit"; // ✅ Added: Track if adding or editing

  openAddSheet: (categoryId: string) => void; // ✅ New
  openEditSheet: (productId: string, categoryId: string) => void; // ✅ New
  closeSheet: () => void;
}
  
export const useProductSheet = create<ProductSheetState>((set) => ({
  isOpen: false,
  productId: null,
  categoryId: null,
  mode: "add",

  openAddSheet: (categoryId: string) =>
    set({
      isOpen: true,
      productId: null,
      categoryId,
      mode: "add",
    }),

  openEditSheet: (productId: string, categoryId: string) =>
    set({
      isOpen: true,
      productId,
      categoryId,
      mode: "edit",
    }),

  closeSheet: () =>
    set({
      isOpen: false,
      productId: null,
      categoryId: null,
    }),
}));
