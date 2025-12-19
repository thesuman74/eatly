"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { productListSheetStore } from "@/stores/ui/productListSheetStore";
import { useOrderWorkspace } from "@/stores/workspace/useOrderWorkspace";
import { OrderItem } from "@/lib/types/order-types";
import { useCartStore } from "@/stores/admin/useCartStore";

interface EditableOrderItemsListProps {
  itemsWithDetails: OrderItem[];
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  paymentStatus?: string;
}

export default function EditableOrderItemsList({
  paymentStatus = "Pending",
}: EditableOrderItemsListProps) {
  const {
    cartItems,
    updateQuantity: updateCartQuantity,
    removeFromCart,
  } = useCartStore();

  const updateQuantity = (itemId: string, quantity: number) => {
    updateCartQuantity(itemId, quantity);
  };

  const removeItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const { openProductList } = useOrderWorkspace();

  return (
    <>
      <div className="w-full max-w-md bg-white border rounded shadow-md flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b bg-blue-500 p-2 text-white">
          <span
            className="font-bold text-lg hover:cursor-pointer"
            onClick={openProductList}
          >
            + Products
          </span>
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 min-h-[250px] max-h-[250px]">
          {cartItems?.map((item, index) => (
            <div
              key={item.id + index}
              className="flex items-center gap-4 mb-4 bg-gray-100 rounded-lg p-1"
            >
              <img
                src={item.product?.images?.[0]?.url || "/Images/coffee.png"}
                alt={item.product?.images?.[0]?.alt || item.product?.name || ""}
                className="h-16 w-16 object-cover rounded-lg"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between w-full items-center">
                  <h4 className="w-full line-clamp-1 font-semibold">
                    {item.product?.name}
                  </h4>
                  <span>${item.unit_price}</span>
                  <button
                    className="text-gray-500 px-2"
                    onClick={() => removeItem(item.product_id)}
                  >
                    <X />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() =>
                      updateQuantity(item.product_id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product_id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
