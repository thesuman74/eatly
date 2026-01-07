// types/order.ts

import { ProductTypes } from "./menu-types";

export interface Order {
  id: string;
  customer_name: string;
  order_type: OrderType;
  title?: string;
  status: OrderStatus;
  payment_status: PaymentStatus;

  created_at: string;
  updated_at: string;
  items: OrderItem[];
  payments: OrderPayment[];
  status_logs?: OrderStatusLog[];
  total_amount: number;
  order_number: string;
  order_source: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product?: ProductTypes; // optional, for UI/cart purposes

  product_name: string;

  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  addons?: OrderItemAddon[];
}

export interface OrderItemAddon {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderPayment {
  id: string;
  method: PaymentMethod;
  amount_paid: number;
  tip: number;
  change_returned: number;
  created_at: string;
  payment_status: PaymentStatus;
}

export interface OrderStatusLog {
  id: string;
  status: OrderStatus;
  created_at: string;
}

// ENUMS
export type OrderType = "OnSite" | "Takeaway" | "Delivery";

export const ORDER_TYPES = {
  ON_SITE: "OnSite",
  TAKEAWAY: "Takeaway",
  DELIVERY: "Delivery",
} as const;

// payment-status.ts

export const PAYMENT_STATUS = {
  UNPAID: "unpaid",
  PAID: "paid",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// order-status.ts

export const ORDER_STATUS = {
  DRAFT: "draft",
  ACCEPTED: "accepted",
  PREPARING: "preparing",
  READY: "ready",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const PAYMENT_METHOD = {
  CASH: "cash",
  CARD: "card",
  PAYPAL: "paypal",
  ESEWA: "esewa",
  KHALTI: "khalti",
  null: null,
};

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export interface CreateOrderPayload {
  order: {
    id?: string; // <-- add this

    order_type?: OrderType; // nullable in DB
    customer_name?: string;
    customer_phone?: string;
    customer_address?: string;
    notes?: string;
    order_source?: string;

    // Optional override — backend defaults to "unpaid"
    payment_status?: PaymentStatus;
    restaurant_id: string;
  };

  items: OrderItemPayload[];

  // Optional: only present for paid / finalized orders
  payment?: OrderPaymentPayload;
}

export interface OrderPaymentPayload {
  method: PaymentMethod;
  amount_paid: number;
  tip?: number;
  change_returned?: number;
  payment_status?: PaymentStatus;
}

export interface OrderItemPayload {
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
}

// /lib/types/order-types.ts

export enum ORDER_CANCEL_REASONS {
  CUSTOMER_REQUEST = "customer_request",
  REJECTED_ORDER = "rejected_order",
  TEST_ORDER = "test_order",
  PAYMENT_FAILED = "payment_failed",
  RESTAURANT_CLOSED = "restaurant_closed",
  OTHER = "other",
}

// Optional: if you want a mapping for labels
export const ORDER_CANCEL_REASON_LABELS: Record<ORDER_CANCEL_REASONS, string> =
  {
    [ORDER_CANCEL_REASONS.CUSTOMER_REQUEST]: "Customer Request",
    [ORDER_CANCEL_REASONS.REJECTED_ORDER]: "Rejected Order",
    [ORDER_CANCEL_REASONS.TEST_ORDER]: "Test Order",
    [ORDER_CANCEL_REASONS.PAYMENT_FAILED]: "Payment Failed",
    [ORDER_CANCEL_REASONS.RESTAURANT_CLOSED]: "Restaurant Closed",
    [ORDER_CANCEL_REASONS.OTHER]: "Other",
  };

export type OrderActionType =
  | "accept"
  | "finish"
  | "status"
  | "pay"
  | "cancel"
  | "delete"
  | null;

export type OrderActionState = {
  orderId: string | null;
  type: OrderActionType;
};
