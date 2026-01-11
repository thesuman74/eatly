import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/types/order-types";

type OrderActionState = {
  showPay: boolean;
  showPaid: boolean;
  showAccept: boolean;
  showFinalize: boolean;
  showCancel: boolean;
};

function deriveOrderActions(order: any): OrderActionState {
  const paymentStatus = order.payment_status;
  const orderStatus = order.status;

  const isFinalPayment =
    paymentStatus === PAYMENT_STATUS.REFUNDED ||
    paymentStatus === PAYMENT_STATUS.CANCELLED;

  const isPaid = paymentStatus === PAYMENT_STATUS.PAID;
  const isAccepted = orderStatus !== ORDER_STATUS.DRAFT;

  return {
    showPay: !isPaid && !isFinalPayment,
    showPaid: isPaid,
    showAccept: !isAccepted && !isFinalPayment,
    showFinalize: isPaid && isAccepted,
    showCancel: !isFinalPayment,
  };
}
