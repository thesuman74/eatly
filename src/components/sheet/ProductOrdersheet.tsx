"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import React, { useEffect, useState } from "react";
import { Calendar, Check, Clock, Hash, Utensils, X } from "lucide-react";
import { useOrderSheet } from "@/app/stores/useOrderSheet";
import { useOrder } from "@/hooks/order/useOrders";
import { timeAgo } from "@/utils/time";
import { formatCreatedDate } from "@/utils/date";

const ProductOrdersheet = () => {
  const { isOpen, orderId, closeSheet } = useOrderSheet();
  const { data: order, isLoading, error } = useOrder(orderId || "");

  console.log("order data in sheet", order);

  // ✅ Local state for editable fields
  const [title, setTitle] = useState("suman");
  const [clientName, setClientName] = useState("suman");
  const [items, setItems] = useState<any[]>([]);

  // ✅ Populate state when order changes
  useEffect(() => {
    if (order) {
      setTitle(order.title || "");
      setClientName(order.customer_name || "");
      setItems(order.items || []);
    } else {
      setTitle("");
      setClientName("");
      setItems([]);
    }
  }, [order]);

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetTitle>Order {order?.order_number}</SheetTitle>
      <SheetContent className="p-0">
        <aside className="h-screen max-w-sm w-full bg-gray-100">
          {/* Header */}
          <div className="flex px-4 py-2 bg-yellow-500 text-white">
            <div className="flex space-x-2">
              <Hash />
              <span className="text-xl font-semibold">
                {order?.order_number}
              </span>
            </div>
            <div className="flex space-x-4 items-center px-1">
              <Utensils size={20} />
              <span>{order?.order_type || "On site"}</span>
              <span> | </span>
              <span>{order?.status}</span>
            </div>
          </div>

          {/* POS and Time */}
          <div className="flex justify-between items-center bg-yellow-50 px-2">
            <div className="flex justify-between py-2">
              <span className="font-semibold bg-gray-200 px-4 py-1 mx-1 rounded-full text-xs">
                POS
              </span>
              <div className="flex items-center">
                <Calendar size={16} />
                <span>{formatCreatedDate(order?.created_at)}</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock size={16} />
              <span>{timeAgo(order?.created_at)}</span>
            </div>
          </div>

          <hr className="border-gray-400" />

          {/* Editable Inputs */}
          <Input
            type="text"
            name="product_title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add title"
            className="w-full border"
          />

          <Input
            type="text"
            name="client_name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Add Client Name"
            className="w-full border text-lg"
          />

          {/* Products Section */}
          <div className="py-2 flex-1 overflow-y-auto">
            <div className="border-b border-gray-400 bg-blue-500 text-white">
              <span className="text-lg font-semibold px-4 py-1">Products</span>
            </div>
            <div className="min-h-[320px] p-2 bg-white">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between py-1">
                  <span>{item.name}</span>
                  <span>
                    {item.quantity} x ${item.unit_price / 100}
                  </span>
                </div>
              ))}
            </div>
            <div className="py-4 px-2 border-dashed border-gray-400">
              <span className="text-gray-700">Sub total: </span>
              <span>${order?.total_amount / 100}</span>
            </div>
          </div>

          {/* Payment section */}
          <div className="flex justify-between px-2">
            <span className="text-lg font-semibold rounded-full px-4 py-1 mx-1 bg-yellow-400 text-white">
              {order?.payment_status || "Unpaid"}
            </span>
            <div className="space-x-2">
              <span>Total:</span>
              <span>RS</span>
              <span className="text-2xl">${order?.total_amount / 100}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center w-full gap-4 px-2">
            <Button
              variant="outline"
              className="text-red-500 border-red-500 w-full"
              onClick={closeSheet}
            >
              <X /> Cancel
            </Button>

            <Button
              variant="outline"
              className="text-blue-500 border-blue-500 w-full"
            >
              $ Pay
            </Button>

            <Button
              variant="default"
              className="text-white bg-green-500 w-full"
            >
              <Check /> Confirm
            </Button>
          </div>
        </aside>
      </SheetContent>
    </Sheet>
  );
};

export default ProductOrdersheet;
