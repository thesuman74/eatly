// src/lib/orderStatusUi.ts
import { OrderStatus } from "@/lib/types/order-types";

type OrderStatusUIConfig = {
  headerBg: string;
  headerText: string;
  badgeBg: string;
  badgeText: string;
};

export const ORDER_STATUS_UI: Record<OrderStatus, OrderStatusUIConfig> = {
  draft: {
    headerBg: "bg-blue-500 text-white",
    headerText: " text-orange-500",
    badgeBg: "bg-blue-500",
    badgeText: "text-white",
  },

  accepted: {
    headerBg: "bg-blue-500 text-white",
    headerText: "text-blue-500",
    badgeBg: "bg-blue-500",
    badgeText: "text-white",
  },

  preparing: {
    headerBg: "bg-green-300 text-white",
    headerText: "text-green-500",
    badgeBg: "bg-green-500",
    badgeText: "text-white",
  },

  ready: {
    headerBg: "bg-green-500 text-white",
    headerText: "text-green-500",
    badgeBg: "bg-green-600",
    badgeText: "text-white",
  },

  completed: {
    headerBg: "bg-green-600 text-white",
    headerText: "text-green-600",
    badgeBg: "bg-green-600",
    badgeText: "text-white",
  },

  delivered: {
    headerBg: "bg-gray-600 text-white",
    headerText: "text-gray-600",
    badgeBg: "bg-gray-600",
    badgeText: "text-white",
  },

  cancelled: {
    headerBg: "bg-red-500 text-white",
    headerText: "bg-red-500 text-white",
    badgeBg: "bg-red-500",
    badgeText: "text-white",
  },
};
