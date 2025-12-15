// components/PaymentSummary.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/app/stores/useCartStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateOrder } from "@/hooks/order/useOrders";
import {
  CreateOrderPayload,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PaymentMethod,
} from "@/lib/types/order-types";
import { buildOrderPayload } from "@/utils/buildOrderPayload";

interface PaymentSummaryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PaymentSummary = ({ open, setOpen }: PaymentSummaryProps) => {
  const cartTotal = useCartStore((state) => state.cartTotal());
  const cartItems = useCartStore((state) => state.cartItems);
  const [tips, setTips] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">(""); // allow empty initially
  const { paymentStatus, setPaymentStatus } = useCartStore();

  const tipsAmount = parseFloat(tips) || 0;
  const received = parseFloat(amountReceived) || 0;
  const totalToPay = cartTotal + tipsAmount;
  const change = received - totalToPay;

  const createOrderMutation = useCreateOrder();

  console.log("cartItems from payment summary", cartItems);

  const handleRegisterPayment = () => {
    setPaymentStatus(PAYMENT_STATUS.PAID);
    setOpen(false);
    toast.success("Simulating Payment Success ");
  };

  const handleSaveasPending = () => {
    setPaymentStatus(PAYMENT_STATUS.UNPAID);
    setOpen(false);
    toast.success("Simulating Payment Pending ");
  };

  const handleRegisterAndAcceptOrder = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // Use the helper to build the payload from the cart state
    const payload: CreateOrderPayload = buildOrderPayload();

    try {
      await createOrderMutation.mutateAsync(payload);
      toast.success("Order registered successfully!");
      setPaymentStatus(PAYMENT_STATUS.PAID);
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to register order");
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
              paymentStatus === PAYMENT_STATUS.PAID
                ? "bg-green-600"
                : "bg-yellow-400"
            }`}
          >
            {paymentStatus?.toUpperCase() || "PENDING"}
          </span>
        </div>
        {/* Payment Inputs */}
        <div className="px-4 bg-white space-y-4 py-4">
          {/* Payment Method */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <Select
              onValueChange={(value) =>
                setPaymentMethod(value as PaymentMethod)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="paypal">Paypal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Subtotal */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
              Subtotal
            </label>
            <Input
              value={cartTotal.toFixed(2)}
              readOnly
              className="flex-1 !text-lg"
              disabled
            />
          </div>

          {/* Tips */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
              Tips
            </label>
            <Input
              type="number"
              placeholder="Enter tip amount"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
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
              // placeholder="Enter amount received"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
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
              Amount received is less than total (Rs {totalToPay.toFixed(2)})
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white mt-auto mb-20 border-t p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Input type="checkbox" className="w-4 h-4" />
            <Badge
              variant="outline"
              className="text-sm text-gray-600 border-dashed"
            >
              Save as Pending
            </Badge>
          </div>

          <Button
            variant="outline"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-100"
            onClick={() => handleRegisterPayment()}
          >
            Register Payment
          </Button>
          <Button
            variant="outline"
            className="w-full bg-green-100 border-green-600 text-green-700 hover:bg-green-200"
            onClick={handleRegisterAndAcceptOrder}
          >
            Register and Accept Order
          </Button>
        </div>
      </div>
    </>
  );
};

export default PaymentSummary;
