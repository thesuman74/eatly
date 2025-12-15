import {
  ORDER_STATUS,
  OrderStatus,
  PAYMENT_STATUS,
  PaymentStatus,
} from "../types/order-types";

export type OrderAction = "ACCEPT" | "FINISH";

export function getOrderAction(order: { status: OrderStatus }): OrderAction {
  return order.status === ORDER_STATUS.DRAFT ? "ACCEPT" : "FINISH";
}

export function requiresPayment(order: { payment_status: PaymentStatus }) {
  return order.payment_status !== PAYMENT_STATUS.PAID;
}
