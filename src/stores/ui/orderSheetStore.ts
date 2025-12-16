import { create } from "zustand";

interface OrderSheetStoreState {
  isOpen: boolean;
  orderId: string | null;
  openSheet: (orderId: string) => void;
  closeSheet: () => void;
}

export const OrderSheetStore = create<OrderSheetStoreState>((set) => ({
  isOpen: false,
  orderId: null,
  openSheet: (orderId: string) => set({ isOpen: true, orderId }),
  closeSheet: () => set({ isOpen: false, orderId: null }),
}));
