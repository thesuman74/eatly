import { create } from "zustand";

interface OrderSheetState {
  isOpen: boolean;
  orderId: string | null;
  openSheet: (orderId: string) => void;
  closeSheet: () => void;
}

export const useOrderSheet = create<OrderSheetState>((set) => ({
  isOpen: false,
  orderId: null,
  openSheet: (orderId: string) => set({ isOpen: true, orderId }),
  closeSheet: () => set({ isOpen: false, orderId: null }),
}));
