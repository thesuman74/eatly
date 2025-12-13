import { create } from "zustand";

interface OrderWorkspaceState {
  isProductListOpen: boolean;
  openProductList: () => void;
  closeProductList: () => void;
  orderId: string | null;

  isProductOrderSheetOpen: boolean;
  openProductOrderSheet: (orderId: string) => void;
  closeProductOrderSheet: () => void;
}

export const useOrderWorkspace = create<OrderWorkspaceState>((set) => ({
  orderId: null,

  isProductListOpen: false,
  openProductList: () => set({ isProductListOpen: true }),
  closeProductList: () => set({ isProductListOpen: false }),

  isProductOrderSheetOpen: false,
  openProductOrderSheet: (orderId: string) =>
    set({ isProductOrderSheetOpen: true, orderId }),
  closeProductOrderSheet: () => set({ isProductOrderSheetOpen: false }),
}));
