// types/backend-order.ts
import {
  Order,
  OrderItem,
  OrderPayment,
  OrderStatusLog,
} from "@/lib/types/order-types";
import { ProductTypes } from "../menu-types";

export interface BackendOrder extends Order {
  user_id: string | null;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number; // backend's total
  customer_phone?: string | null;
  customer_address?: string | null;
  notes?: string | null;
}

export interface BackendOrderItem extends OrderItem {
  order_id: string;
  created_at: string;
  product: ProductTypes; // full product info from backend
}

export interface BackendOrderPayment extends OrderPayment {
  order_id: string;
}
