// src/lib/orders/payment-status.ts
import {
  PAYMENT_STATUS,
  PaymentStatus,
  OrderPayment,
} from "@/lib/types/order-types";

export function getEffectivePaymentStatus(
  payments?: OrderPayment[]
): PaymentStatus {
  if (!payments || payments.length === 0) {
    return PAYMENT_STATUS.UNPAID;
  }

  if (payments.some((p) => p.payment_status === PAYMENT_STATUS.REFUNDED)) {
    return PAYMENT_STATUS.REFUNDED;
  }

  if (payments.some((p) => p.payment_status === PAYMENT_STATUS.PAID)) {
    return PAYMENT_STATUS.PAID;
  }

  return PAYMENT_STATUS.UNPAID;
}
