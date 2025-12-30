"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Check, Clock, Hash, Utensils, X } from "lucide-react";
import React, { useState } from "react";
import CartPreview from "./CartPreview";
import { useCartStore } from "@/stores/admin/useCartStore";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { PAYMENT_STATUS } from "@/lib/types/order-types";
import PaymentSummary from "../payments/PaymentSummary";

const ProductOrderSideBar = () => {
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const paymentStatus = useCartStore((state) => state.paymentStatus);

  const searchParams = useSearchParams();
  const orderType = searchParams.get("type");

  const { cartItems, setCustomerName, setOrderTitle } = useCartStore();

  const handlePayment = () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setShowPaymentPanel(true);
  };

  const handleConfirm = () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    {
      {
        paymentStatus === PAYMENT_STATUS.UNPAID || paymentStatus === null
          ? setShowPaymentPanel(true)
          : null;
      }
    }
  };

  return (
    <>
      <aside className="h-screen  max-w-sm w-full flex flex-col bg-gray-100 overflow-y-auto">
        {showPaymentPanel ? (
          <PaymentSummary
            open={showPaymentPanel}
            setOpen={setShowPaymentPanel}
          />
        ) : (
          <div className="">
            {/* Top Section */}
            <div className="shrink-0 ">
              <div
                className={`flex px-4 py-2  text-white ${
                  paymentStatus === PAYMENT_STATUS.PAID
                    ? "bg-green-600"
                    : "bg-yellow-400"
                }`}
              >
                <div className="flex space-x-2">
                  <Hash />
                  <span className="text-lg font-semibold">1</span>
                </div>
                <div className="flex space-x-4 items-center px-1">
                  <span>
                    <Utensils size={20} />
                  </span>
                  <span className="px-1">
                    {orderType?.toUpperCase() || "On site"}
                  </span>{" "}
                  <span> | </span>{" "}
                  <span> {paymentStatus?.toUpperCase() || "PENDING"}</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-yellow-50/80 px-2">
                <div className="flex justify-between py-2">
                  <span className="font-semibold bg-gray-200 px-4 py-1 mx-1 rounded-full text-xs">
                    POS
                  </span>
                  <div className="flex items-center">
                    <span>
                      <Calendar size={16} />
                    </span>
                    <span>13/07/25 12:28</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>
                      <Clock size={16} />
                    </span>
                    {/* <span>01:11 minutes</span> */}
                  </div>
                </div>
              </div>
              <hr className="border-gray-400" />

              <div className="space-y-2 py-2">
                <Input
                  type="text"
                  name="product_title"
                  placeholder="Add title"
                  onBlur={(e) => setOrderTitle(e.target.value)}
                  className="w-full border"
                />

                <Input
                  type="text"
                  name="client_name"
                  placeholder="Add Client Name"
                  onBlur={(e) => setCustomerName(e.target.value)}
                  className="w-full border text-lg"
                />
              </div>
            </div>

            {/* Middle (scrollable) */}
            <div className="flex-1 overflow-y-auto ">
              <CartPreview />

              {/* Bottom Section */}
              <div className="shrink-0  mt-auto  ">
                <div className="flex flex-wrap items-center space-y-2 space-x-2 text-sm text-nowrap px-2 ">
                  <div className="flex justify-center w-full gap-4 px-2 py-2 ">
                    <Button
                      variant={"outline"}
                      className="text-red-500 border-red-500 w-full"
                    >
                      <span className="cursor-pointer">
                        <X />
                      </span>
                      <span>Cancel</span>
                    </Button>

                    <Button
                      variant={"outline"}
                      onClick={() => handlePayment()}
                      className="text-blue-500 border-blue-500 w-full"
                    >
                      <span className="cursor-pointer">$</span>
                      <span>Pay</span>
                    </Button>

                    <Button
                      variant={"default"}
                      className="text-white bg-green-500 w-full"
                      onClick={() => handleConfirm()}
                    >
                      <span className="cursor-pointer">
                        <Check />
                      </span>
                      <span>Confirm</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default ProductOrderSideBar;
