import { create } from "zustand";

interface paymentPanelStoreState {
  orderId: string | null;
  isPaymentSheetOpen: boolean;
  openpaymentPanelStore: (orderId: string) => void;
  closepaymentPanelStore: () => void;
}

export const paymentPanelStore = create<paymentPanelStoreState>((set) => ({
  orderId: null,

  isPaymentSheetOpen: false,
  openpaymentPanelStore: (orderId: string) =>
    set({ isPaymentSheetOpen: true, orderId }),
  closepaymentPanelStore: () => set({ isPaymentSheetOpen: false }),
}));
