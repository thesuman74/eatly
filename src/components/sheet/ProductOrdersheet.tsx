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
import CartPreview from "@/app/dashboard/order/_components/Products/CartPreview";
import EditableOrderItemsList from "@/app/dashboard/order/_components/Products/EditableOrderItemsList";

const ProductOrdersheet = () => {
  const { isOpen, orderId, closeSheet } = useOrderSheet();
  const { data, isLoading, error } = useOrder(orderId);

  // ✅ Local state for editable fields
  const [title, setTitle] = useState("suman");
  const [clientName, setClientName] = useState("suman");
  const [items, setItems] = useState<any[]>([]);

  // ✅ Populate state when order changes
  useEffect(() => {
    if (!data) return;

    setTitle(data.customer_name || "");
    setClientName(data.customer_name || "");
    setItems(data.items || []);
  }, [data]);

  if (!isOpen) return null;

  if (isLoading || !data) {
    return (
      <Sheet open={isOpen} onOpenChange={closeSheet}>
        <SheetTitle>{null}</SheetTitle>

        <SheetContent className="flex items-center justify-center">
          Loading order details...
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetTitle>{null}</SheetTitle>
      <SheetContent className="p-0 flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-2 bg-yellow-500 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Hash />
            <span className="text-xl font-semibold">{data?.order_number}</span>
          </div>
          <div className="flex space-x-4 items-center mr-6">
            <Utensils size={20} />
            <span>{data?.order_type}</span>
            <span>|</span>
            <span>{data?.status}</span>
          </div>
        </div>

        {/* pos section  */}

        <div className="flex justify-between items-center bg-yellow-50/80 px-2">
          <div className="flex justify-between py-2">
            <span className="font-semibold bg-gray-200 px-4 py-1 mx-1 rounded-full text-xs">
              {data?.payment_status}
            </span>
            <div className="flex items-center">
              <span>
                <Calendar size={16} />
              </span>
              <span>{formatCreatedDate(data?.created_at)}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center space-x-2">
              <span>
                <Clock size={16} />
              </span>
              <span>{timeAgo(data?.created_at)}</span>
            </div>
          </div>
        </div>
        <hr className="border-gray-400" />

        {/* Editable Inputs */}
        <div className="p-2 flex flex-col gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add title"
            className="w-full"
          />
          <Input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Add Client Name"
            className="w-full"
          />
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1  px-2">
          <EditableOrderItemsList
            itemsWithDetails={items}
            onUpdateQuantity={(id, qty) => {
              const updated = items.map((i) =>
                i.id === id ? { ...i, quantity: qty } : i
              );
              setItems(updated);
            }}
            onRemoveItem={(id) => setItems(items.filter((i) => i.id !== id))}
          />
        </div>

        {/* Bottom Section */}
        <div className="px-2 py-2 border-t flex flex-col gap-2">
          {/* Extras like Discount/Packaging */}
          <div className="flex gap-2">
            <Button className="bg-green-500 text-gray-700 px-4 py-1">
              + Discount
            </Button>
            <Button className="bg-gray-200 text-gray-700 px-3 py-1">
              + Servicing
            </Button>
            <Button className="bg-gray-200 text-gray-700 px-3 py-1">
              + Packaging
            </Button>
          </div>

          {/* Total & Payment Status */}
          <div className="flex justify-between items-center mt-2">
            <span
              className={`text-lg font-semibold rounded-full px-4 py-1 mx-1 text-white ${
                data?.payment_status === "Paid"
                  ? "bg-green-600"
                  : "bg-yellow-400"
              }`}
            >
              {data?.payment_status || "PENDING"}
            </span>
            <div className="space-x-2 text-2xl">
              <span>Total:</span>
              <span>RS {items.reduce((sum, i) => sum + i.total_price, 0)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              className="text-red-500 border-red-500 flex-1"
              onClick={closeSheet}
            >
              <X /> Cancel
            </Button>
            <Button
              variant="outline"
              className="text-blue-500 border-blue-500 flex-1"
            >
              $ Pay
            </Button>
            <Button
              variant="default"
              className="text-white bg-green-500 flex-1"
            >
              <Check /> Confirm
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductOrdersheet;
