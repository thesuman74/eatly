"use client";

import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/types/order-types";
import { Button } from "@/components/ui/button";
import { Check, X, DollarSign, Loader2 } from "lucide-react";

type Props = {
  order: {
    status: string;
    payment_status: string;
  };
  loading?: {
    accept?: boolean;
    finalize?: boolean;
  };
  onPay: () => void;
  onAccept: () => void;
  onFinalize: () => void;
  onClose: () => void;
  onOpenPaymentSummary: () => void;
};

export function OrderActionButtons({
  order,
  loading = {
    accept: false,
    finalize: false,
  },
  onPay,
  onAccept,
  onFinalize,
  onClose,
  onOpenPaymentSummary,
}: Props) {
  if (!order) return null; // or a loading state

  const { status, payment_status } = order;

  const isFinalPayment =
    payment_status === PAYMENT_STATUS.REFUNDED ||
    payment_status === PAYMENT_STATUS.CANCELLED;

  const isPaid = payment_status === PAYMENT_STATUS.PAID;
  const isAccepted = status !== ORDER_STATUS.DRAFT;

  return (
    <div className="flex w-full gap-3">
      {/* Cancel */}
      {!isFinalPayment && (
        <Button
          variant="outline"
          className="w-full text-red-500 border-red-500 flex items-center justify-center gap-1"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
          Close
        </Button>
      )}

      {/* Pay */}
      {!isPaid && !isFinalPayment && (
        <Button
          variant="outline"
          className="w-full text-blue-500 border-blue-500 flex items-center justify-center gap-1"
          onClick={onPay}
        >
          <DollarSign className="w-4 h-4" />
          Pay
        </Button>
      )}

      {/* Paid → opens payment summary */}
      {isPaid && (
        <Button
          variant="outline"
          className="w-full text-green-600 border-green-600 flex items-center justify-center gap-1"
          onClick={onOpenPaymentSummary}
        >
          <Check className="w-4 h-4" />
          Paid
        </Button>
      )}

      {/* Accept */}
      {isAccepted && !isFinalPayment && (
        <Button
          className="w-full bg-green-500 text-white flex items-center justify-center gap-1"
          onClick={onAccept}
          disabled={loading.accept}
        >
          {loading.accept ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Accept
        </Button>
      )}

      {/* Finalize */}
      {isPaid && isAccepted && (
        <Button
          className="w-full bg-blue-600 text-white flex items-center justify-center gap-1"
          onClick={onFinalize}
          disabled={loading.finalize}
        >
          {loading.finalize ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Finalize
        </Button>
      )}
    </div>
  );
}
