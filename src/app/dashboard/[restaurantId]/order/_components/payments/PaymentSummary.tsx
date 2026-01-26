// components/PaymentSummary.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/stores/admin/useCartStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Banknote,
  CreditCard,
  DollarSign,
  Icon,
  Loader2,
  MoreHorizontal,
  MoveLeft,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateOrder,
  useUpdateOrder,
  useUpdateOrderStatus,
} from "@/hooks/order/useOrders";
import {
  CreateOrderPayload,
  ORDER_STATUS,
  OrderPayment,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  PaymentMethod,
  PaymentStatus,
} from "@/lib/types/order-types";
import { buildOrderPayload } from "@/utils/buildOrderPayload";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { FaPaypal } from "react-icons/fa6";
import { usePaymentRefund } from "@/hooks/order/usePayements";
import { set } from "zod";
import { PaymentList } from "./PaymentList";
import { PAYMENT_UI } from "@/lib/order/paymentUi";

interface PaymentSummaryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  payments?: OrderPayment[];

  //Actions
  onSaveAsPending: () => void;
  onRegisterAndAccept: () => void;
  onRegister?: () => void;
  onRefund?: () => void;
  onFinalize?: () => void;

  // Loading states
  loading?: {
    pay?: boolean;
    finalize?: boolean;
    refund?: boolean;
    registerAndAccept?: boolean;
  };

  payment_status?: PaymentStatus;
}

const PaymentSummary = ({
  open,
  setOpen,
  payments,
  onSaveAsPending,
  onRegisterAndAccept,
  onRegister,
  onRefund,
  onFinalize,
  loading,
  payment_status,
}: PaymentSummaryProps) => {
  const [isPending, setIsPending] = useState(false);
  const cartTotal = useCartStore((state) => state.cartTotal());
  const {
    amountReceived,
    tips,
    paymentMethod,

    setPaymentMethod,
    setAmountReceived,
    setTips,
  } = useCartStore();

  const [localTips, setLocalTips] = useState(tips?.toString() || "");
  const [localAmountReceived, setLocalAmountReceived] = useState(
    amountReceived?.toString() || "",
  );
  const [isProcessing, setIsProcessing] = useState(false);

  console.log("payments", payments);

  const tipsAmount = parseFloat(localTips);
  const received = parseFloat(localAmountReceived);
  const totalToPay = cartTotal + tipsAmount;
  const change = received - totalToPay;

  const canRegisterAndAccept = isPending || received >= totalToPay;

  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  const isPaid = Boolean(
    payments?.find((p) => p.payment_status === PAYMENT_STATUS.PAID),
  );

  const paymentStatus: PaymentStatus = payment_status ?? PAYMENT_STATUS.UNPAID;
  const paymentUI = PAYMENT_UI[paymentStatus];

  const handleRegisterAndAcceptClick = async () => {
    if (!canRegisterAndAccept) {
      toast.error("Save as pending or provide enough amount");
      return;
    }
    setIsProcessing(true); // 🔒 lock immediately
    setLocalAmountReceived("");
    setLocalTips("");

    try {
      await onRegisterAndAccept?.(); // call parent handler
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false); // unlock if needed
    }
  };

  // const handleRegisterPayment = () => {
  //   setPaymentStatus(PAYMENT_STATUS.PAID);
  //   setOpen(false);
  //   toast.success("Simulating Payment Success ");
  // };

  const handleSaveAsPending = () => {
    // Clear all payment info in cart store
    setTips(0);
    setAmountReceived(0);
    setPaymentMethod(null);

    setIsPending(true); // Mark as pending locally
  };

  const togglePending = () => {
    const newPendingState = !isPending;

    if (newPendingState) {
      handleSaveAsPending();
    }

    setIsPending(newPendingState);
  };

  const PAYMENT_METHODS: {
    value: PaymentMethod;
    label: string;
    Icon: React.FC<any>;
  }[] = [
    { value: "cash", label: "Cash", Icon: DollarSign },
    { value: "card", label: "Card", Icon: CreditCard },
    { value: "paypal", label: "PayPal", Icon: FaPaypal },
    { value: "esewa", label: "eSewa", Icon: Wallet },
    { value: "khalti", label: "Khalti", Icon: Wallet },
  ];

  return (
    <>
      <div className=" flex flex-col h-svh">
        {/* Header */}
        <div className="flex border-b p-2 space-x-4 items-center">
          <MoveLeft className="cursor-pointer" onClick={() => setOpen(false)} />
          <span className="text-lg md:text-xl font-bold">Register Payment</span>

          {payment_status && (
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold
    ${paymentUI.badgeBg} ${paymentUI.badgeText}`}
            >
              {payment_status?.toUpperCase()}
            </span>
          )}
        </div>
        {isPaid && (
          <PaymentList
            payments={payments && payments.length > 0 ? payments : []}
            handleRefundPayment={onRefund || (() => {})}
          />
        )}

        {!isPaid && (
          <>
            {/* Payment Inputs */}
            <div className="px-4  space-y-4 py-4">
              {/* Payment Method */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3 text-sm md:text-md ">
                  {PAYMENT_METHODS.map((method) => {
                    const isActive = paymentMethod === method.value;

                    return (
                      <button
                        key={method.value}
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          setPaymentMethod(method.value as PaymentMethod)
                        }
                        className={`
          rounded-lg border p-2 md:p-3 text-center font-medium transition
          ${
            isActive
              ? "border-primary bg-primary/10 text-primary"
              : "border-muted bg-background hover:bg-muted"
          }
          ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
                      >
                        <div className="flex space-x-2">
                          <span>
                            <method.Icon />
                          </span>
                          <span>{method.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Subtotal */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
                  Subtotal
                </label>
                <Input
                  disabled={isPending}
                  value={cartTotal.toFixed(2)}
                  readOnly
                  className="flex-1 !text-lg"
                />
              </div>

              {/* Tips */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
                  Tips
                </label>
                <Input
                  disabled={isPending}
                  type="number"
                  placeholder="Enter tip amount"
                  value={localTips}
                  onChange={(e) => setLocalTips(e.target.value)}
                  onBlur={(e) => setTips(parseFloat(localTips))}
                  className="flex-1 !text-lg"
                />
              </div>

              {/* Amount To Pay */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
                  To-Pay
                </label>
                <Input
                  type="number"
                  disabled
                  placeholder="Total amount"
                  value={totalToPay.toFixed(2)}
                  readOnly
                  className="!text-2xl font-bold flex-1"
                />
              </div>

              {/* Amount Received */}
              <div className="flex items-center space-x-2 ">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0 pr-2">
                  Amount Received
                </label>
                <Input
                  type="number"
                  disabled={isPending}
                  // placeholder="Enter amount received"
                  value={localAmountReceived}
                  onChange={(e) => setLocalAmountReceived(e.target.value)}
                  onBlur={(e) =>
                    setAmountReceived(parseFloat(localAmountReceived))
                  }
                  className="flex-1 !text-2xl"
                />
              </div>

              <div className="my-2 w-full border-b-2 border-dashed border-gray-300 p-1"></div>

              {/* Change */}
              <div className="flex justify-between items-center font-semibold text-lg">
                <span className="text-gray-600">Change</span>
                <span
                  className={`font-bold ${
                    change >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  Rs {change >= 0 ? change.toFixed(2) : "0.00"}
                </span>
              </div>

              {amountReceived && change < 0 ? (
                <p className="text-sm text-red-500 text-center">
                  Amount received is less than total (Rs {totalToPay.toFixed(2)}
                  )
                </p>
              ) : null}
            </div>

            {/* Actions */}
            <div className=" mt-auto mb-20 border-t p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isPending}
                  onChange={togglePending}
                />

                <Badge
                  variant="outline"
                  className="text-sm text-gray-600 border-dashed cursor-pointer"
                  onClick={togglePending}
                >
                  Save as Unpaid
                </Badge>
              </div>

              {/* <Button
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-100"
                onClick={() => handleRegisterPayment()}
                disabled={isRegisteringPayment}
              >
                Register Payment
              </Button> */}
              <Button
                variant="outline"
                className="w-full bg-green-100 border-green-600 text-green-700 hover:bg-green-200"
                disabled={
                  loading?.registerAndAccept ||
                  !canRegisterAndAccept ||
                  isProcessing
                }
                onClick={handleRegisterAndAcceptClick}
              >
                {loading?.registerAndAccept ||
                  (isProcessing && <Loader2 className="animate-spin" />)}
                Register and Accept Order
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PaymentSummary;

/*
enable
1. amount should be enough 

disable 
2. amount not enought and not pending 


*/
