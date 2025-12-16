import { create } from "zustand";

interface ProductListSheetState {
  isOpen: boolean;
  orderId: string | null;
  openSheet: (productId: string) => void;
  closeSheet: () => void;
}

export const useProductListSheet = create<ProductListSheetState>((set) => ({
  isOpen: false,
  orderId: null,
  openSheet: (orderId: string) => set({ isOpen: true, orderId }),
  closeSheet: () => set({ isOpen: false, orderId: null }),
}));
