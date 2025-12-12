// types/order.ts

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
}

export interface OrderItem {
  id: string;
  product_id: string;
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
export type OrderType = "on_site" | "takeaway" | "delivery";
export type PaymentStatus = "pending" | "paid" | "refunded";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";
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
