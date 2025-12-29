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
} from "@/lib/types/order-types";
import { buildOrderPayload } from "@/utils/buildOrderPayload";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { FaPaypal } from "react-icons/fa6";
import { usePaymentRefund } from "@/hooks/order/usePayements";
import { set } from "zod";
import { PaymentList } from "./PaymentList";

interface PaymentSummaryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  payments?: OrderPayment[];
}

const PaymentSummary = ({ open, setOpen, payments }: PaymentSummaryProps) => {
  console.log("payments", payments);
  const [isPending, setIsPending] = useState(false);
  const cartTotal = useCartStore((state) => state.cartTotal());
  const cartItems = useCartStore((state) => state.cartItems);
  const {
    amountReceived,
    tips,
    paymentMethod,
    currentlyActiveOrderId,
    setCurrentlyActiveOrderId,
    setPaymentStatus,
    setPaymentMethod,
    setAmountReceived,
    setTips,
    clearCart,
  } = useCartStore();

  const [localTips, setLocalTips] = useState(tips?.toString() || "");
  const [localAmountReceived, setLocalAmountReceived] = useState(
    amountReceived?.toString() || ""
  );

  const tipsAmount = parseFloat(localTips);
  const received = parseFloat(localAmountReceived);
  const totalToPay = cartTotal + tipsAmount;
  const change = received - totalToPay;

  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder();
  const paymentRefundMutation = usePaymentRefund();
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  const isPaid = Boolean(
    payments?.find((p) => p.payment_status === PAYMENT_STATUS.PAID)
  );

  // const handleRegisterPayment = () => {
  //   setPaymentStatus(PAYMENT_STATUS.PAID);
  //   setOpen(false);
  //   toast.success("Simulating Payment Success ");
  // };

  const handleSaveAsPending = async () => {
    // clear payment-related local state
    setPaymentMethod(null);
    setAmountReceived(0);
    setTips(0);

    setPaymentStatus(PAYMENT_STATUS.UNPAID);
    // setOpen(false);

    // toast.success("Order saved as pending");
  };

  const handleRegisterAndAcceptOrder = async () => {
    if (!paymentMethod && isPending !== true) {
      toast.error("Please select a payment method");
      return;
    }
    if (amountReceived && amountReceived < totalToPay) {
      toast.error("Amount received is less than total to pay");
      return;
    }
    const saveTips = () => setTips(parseFloat(localTips) || 0);
    const saveAmountReceived = () =>
      setAmountReceived(parseFloat(localAmountReceived) || 0);

    const payload = buildOrderPayload(restaurantId);

    try {
      console.log("inside");
      if (currentlyActiveOrderId) {
        // Update existing order
        await updateOrderMutation.mutateAsync({
          id: currentlyActiveOrderId,
          payload,
        });
        console.log("clearing cart..."), setOpen(false);
        clearCart();
      } else {
        // Create new order
        await createOrderMutation.mutateAsync(payload);
        setOpen(false);
        clearCart();
      }

      setPaymentStatus(PAYMENT_STATUS.PAID);
      setOpen(false);
      clearCart();
    } catch (error: any) {
      toast.error(error.message || "Failed to register order");
    } finally {
      setOpen(false);
      clearCart();
      setCurrentlyActiveOrderId("");
    }
  };

  const updateOrderStatusMutation = useUpdateOrderStatus();

  const isRegisteringPayment = Boolean(
    updateOrderMutation.isPending || createOrderMutation.isPending
  );

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

  const handleRefundPayment = async () => {
    if (!currentlyActiveOrderId) {
      toast.error("No active order to refund");
      return;
    }

    try {
      // Call your mutation
      await paymentRefundMutation.mutateAsync({
        orderId: currentlyActiveOrderId,
        restaurantId,
      });
      setOpen(false);

      toast.success("Payment refunded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to refund payment");
    }
  };

  const handleFinalizeOrder = async () => {
    if (!currentlyActiveOrderId) {
      toast.error("No active order to finalize");
      return;
    }

    try {
      await updateOrderStatusMutation.mutateAsync({
        id: currentlyActiveOrderId,
        status: ORDER_STATUS.COMPLETED, // or your enum value
      });

      setOpen(false);
      clearCart(); // ✅ correct place
      setCurrentlyActiveOrderId("");
    } catch (error: any) {
      toast.error(error.message || "Failed to finalize order");
    }
  };

  return (
    <>
      <div className=" flex flex-col h-screen">
        {/* Header */}
        <div className="flex border-b p-2 space-x-4 items-center">
          <MoveLeft className="cursor-pointer" onClick={() => setOpen(false)} />
          <span className="text-xl font-bold">Register Payment</span>
          <span
            className={`text-lg font-semibold rounded-full px-4 py-1 mx-1  text-white ${
              isPaid ? "bg-green-600" : "bg-yellow-400"
            }`}
          >
            {payments?.map((p) => p.payment_status)}
          </span>
        </div>
        <PaymentList
          payments={payments && payments.length > 0 ? payments : []}
          handleRefundPayment={handleRefundPayment}
        />

        {!isPaid && (
          <>
            {/* Payment Inputs */}
            <div className="px-4 bg-white space-y-4 py-4">
              {/* Payment Method */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
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
          rounded-lg border p-4 text-center font-medium transition
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

              {amountReceived && change < 0 && (
                <p className="text-sm text-red-500 text-center">
                  Amount received is less than total (Rs {totalToPay.toFixed(2)}
                  )
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white mt-auto mb-20 border-t p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isPending}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsPending(checked);

                    if (checked) {
                      handleSaveAsPending();
                    }
                  }}
                />

                <Badge
                  variant="outline"
                  className="text-sm text-gray-600 border-dashed cursor-pointer"
                  onClick={() => {
                    setIsPending(true);
                    handleSaveAsPending();
                  }}
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
                disabled={isRegisteringPayment}
                // disabled={true}
                onClick={handleRegisterAndAcceptOrder}
              >
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
