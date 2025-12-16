import { create } from "zustand";

interface productListSheetStoreState {
  isOpen: boolean;
  orderId: string | null;
  openSheet: (productId: string) => void;
  closeSheet: () => void;
}

export const productListSheetStore = create<productListSheetStoreState>(
  (set) => ({
    isOpen: false,
    orderId: null,
    openSheet: (orderId: string) => set({ isOpen: true, orderId }),
    closeSheet: () => set({ isOpen: false, orderId: null }),
  })
);
