import { PaymentStatus } from "./types/order-types";

type PaymentUIConfig = {
  label: string;
  headerBg: string;
  badgeBg: string;
  badgeText: string;
};

export const PAYMENT_UI: Record<PaymentStatus, PaymentUIConfig> = {
  unpaid: {
    label: "UNPAID",
    headerBg: "bg-yellow-400 text-white",
    badgeBg: "bg-yellow-400",
    badgeText: "text-white",
  },

  paid: {
    label: "PAID",
    headerBg: "bg-green-600 text-white",
    badgeBg: "bg-green-600",
    badgeText: "text-white",
  },

  refunded: {
    label: "REFUNDED",
    headerBg: "bg-red-500 text-white",
    badgeBg: "bg-red-300",
    badgeText: "text-red-800",
  },

  cancelled: {
    label: "CANCELLED",
    headerBg: "bg-gray-500 text-white",
    badgeBg: "bg-gray-100",
    badgeText: "text-gray-800",
  },
};
