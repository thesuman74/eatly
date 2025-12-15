import { create } from "zustand";

interface PaymentPanelSheetState {
  orderId: string | null;
  isPaymentSheetOpen: boolean;
  openPaymentPanelSheet: (orderId: string) => void;
  closePaymentPanelSheet: () => void;
}

export const usePaymentPanelSheet = create<PaymentPanelSheetState>((set) => ({
  orderId: null,

  isPaymentSheetOpen: false,
  openPaymentPanelSheet: (orderId: string) =>
    set({ isPaymentSheetOpen: true, orderId }),
  closePaymentPanelSheet: () => set({ isPaymentSheetOpen: false }),
}));
