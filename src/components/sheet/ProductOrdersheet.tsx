"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import React, { useEffect, useState } from "react";
import { Calendar, Check, Clock, Hash, Utensils, X } from "lucide-react";
import { useOrderSheet } from "@/app/stores/useOrderSheet";
import {
  useDeleteOrderItem,
  useOrder,
  useUpdateOrderItem,
} from "@/hooks/order/useOrders";
import { timeAgo } from "@/utils/time";
import { formatCreatedDate } from "@/utils/date";
import CartPreview from "@/app/dashboard/order/_components/Products/CartPreview";
import EditableOrderItemsList from "@/app/dashboard/order/_components/Products/EditableOrderItemsList";
import PaymentSummary from "@/app/dashboard/order/_components/payments/PaymentSummary";
import { useOrderWorkspace } from "@/stores/workspace/useOrderWorkspace";
import { useCartStore } from "@/app/stores/useCartStore";

const ProductOrdersheet = () => {
  const { openProductOrderSheet, orderId } = useOrderWorkspace();
  const { isProductOrderSheetOpen, closeProductOrderSheet } =
    useOrderWorkspace();

  const { data, isLoading, error } = useOrder(orderId);

  console.log("data", data);

  const [showPaymentPanel, setShowPaymentPanel] = useState(false);

  const {
    currentlyActiveOrderId,
    setCurrentlyActiveOrderId,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    setCustomerName,
    setOrderTitle,
  } = useCartStore();

  const updateOrderItemMutation = useUpdateOrderItem();
  const deleteOrderItemMutation = useDeleteOrderItem();

  // ✅ Initialize cart store when order data changes
  useEffect(() => {
    if (!data || !orderId) return;

    setCurrentlyActiveOrderId(orderId);
    setCartItems(data.items || []);
    setCustomerName(data.customer_name || "");
    setOrderTitle(data.order_title || "");
  }, [data, orderId]);

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    // Update cart store (local editable state)
    updateQuantity(itemId, quantity);

    // Optimistic server update
    updateOrderItemMutation.mutate({ itemId, quantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    deleteOrderItemMutation.mutate({ itemId });
  };

  if (!isProductOrderSheetOpen) return null;

  if (isLoading) {
    return (
      <div>
        <p className="flex items-center justify-center">
          Loading order details...
        </p>
      </div>
    );
  }

  return (
    <>
      <section>
        {isProductOrderSheetOpen && (
          <aside className="h-screen fixed top-16 right-0  max-w-sm w-full flex flex-col bg-gray-100 overflow-y-auto">
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
                      data.paymentStatus === "Paid"
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
                        {data.orderType?.toUpperCase() || "On site"}
                      </span>{" "}
                      <span> | </span>{" "}
                      <span>
                        {" "}
                        {data.paymentStatus?.toUpperCase() || "PENDING"}
                      </span>
                    </div>
                    {/* <div className=" flex justify-end p-1 border-b"> */}
                    <button
                      className="p-2 rounded hover:bg-gray-100 transition"
                      onClick={closeProductOrderSheet}
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                    {/* </div> */}
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
                        <span>01:11 minutes</span>
                      </div>
                    </div>
                  </div>
                  <hr className="border-gray-400" />

                  <div className="space-y-2 py-2">
                    <Input
                      type="text"
                      name="product_title"
                      placeholder="Add title"
                      className="w-full border"
                    />

                    <Input
                      type="text"
                      name="client_name"
                      placeholder="Add Client Name"
                      className="w-full border text-lg"
                    />
                  </div>
                </div>

                {/* Middle (scrollable) */}
                <div className="flex-1 overflow-y-auto ">
                  <EditableOrderItemsList
                    itemsWithDetails={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                  />

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
                          // onClick={() => handlePayment()}
                          className="text-blue-500 border-blue-500 w-full"
                        >
                          <span className="cursor-pointer">$</span>
                          <span>Pay</span>
                        </Button>

                        <Button
                          variant={"default"}
                          className="text-white bg-green-500 w-full"
                          // onClick={() => handleConfirm()}
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
        )}
      </section>
    </>
  );
};

export default ProductOrdersheet;
