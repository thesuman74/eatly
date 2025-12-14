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
}

export interface OrderItem {
  id: string;
  product_id: string;
  product?: ProductTypes; // optional, for UI/cart purposes

  name: string;

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
}

export interface OrderStatusLog {
  id: string;
  status: OrderStatus;
  created_at: string;
}

// ENUMS
export type OrderType = "OnSite" | "Takeaway" | "Delivery";

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
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export type PaymentMethod = "cash" | "card" | "paypal" | "esewa" | "khalti";

export interface CreateOrderPayload {
  order: {
    customer_name: string;
    order_type: OrderType;
    title?: string;
    payment_status: PaymentStatus;
  };
  items: {
    product_id: string;
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    notes?: string;
  }[];
  payment: {
    method: PaymentMethod;
    amount_paid: number;
    tip: number;
    change_returned: number;
  };
}
