"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { useOrderWorkspace } from "@/stores/workspace/useOrderWorkspace";
import { useCartStore } from "@/stores/admin/useCartStore";
import { OrderItem } from "@/lib/types/order-types";
import { useCreateOrder, useUpdateOrderItem } from "@/hooks/order/useOrders";
import { buildOrderPayload } from "@/utils/buildOrderPayload";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";

interface EditableOrderItemsListProps {
  itemsWithDetails: OrderItem[];
  paymentStatus?: string;
}

export default function EditableOrderItemsList({
  paymentStatus = "unpaid",
}: EditableOrderItemsListProps) {
  const { cartItems, updateQuantity, removeFromCart, clearCart } =
    useCartStore();
  const { openProductList } = useOrderWorkspace();
  const updateOrderMutation = useUpdateOrderItem();
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  // Only items with action for the "Updated List"
  const modifiedItems = useMemo(
    () =>
      cartItems.filter(
        (item) => item.action === "update" || item.action === "remove",
      ),
    [cartItems],
  );
  const handleUpdateCart = async () => {
    try {
      const payload = buildOrderPayload(restaurantId);
      await updateOrderMutation.mutateAsync(payload);
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  return (
    <div className="w-full max-w-md bg-background border rounded shadow-md flex flex-col">
      {/* Fixed Header */}
      <div className="flex items-center justify-between border-b dark:bg-muted bg-blue-500 p-2 text-white">
        <span
          className="font-bold text-lg hover:cursor-pointer"
          onClick={openProductList}
        >
          + Products
        </span>
      </div>

      {/* Scrollable Items List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 min-h-[180px] md:min-h-[240px] max-h-[140px] md:max-h-[250px]">
        {/* 1️⃣ Unchanged / previously existing items */}
        {cartItems
          .filter((item) => item.action === "add")
          .map((item, index) => (
            <div
              key={item.id + index}
              className="flex items-center text-sm md:text-md gap-4 mb-4 border rounded-lg p-1"
            >
              <img
                src={item.product?.images?.[0]?.url || "/Images/coffee.png"}
                alt={item.product?.images?.[0]?.alt || item.product?.name || ""}
                className="size-10 md:size-16 object-cover rounded-lg"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between w-full items-center">
                  <h4 className="w-full line-clamp-1 font-semibold">
                    {item.product?.name}
                  </h4>
                  <span>${item.unit_price}</span>
                  <button
                    className="text-gray-500 px-2"
                    onClick={() => removeFromCart(item.product_id)}
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

        {/* 2️⃣ Updated / Added / Removed items */}
        {modifiedItems.length > 0 && (
          <>
            <div className="px-2 py-1 font-semibold text-sm border-b mt-2 mb-2">
              Updated List
            </div>
            {modifiedItems.map((item, index) => (
              <div
                key={item.id + "_mod_" + index}
                className={`flex items-center gap-4 mb-4 border rounded-lg p-1 ${
                  item.action === "remove" ? "line-through" : ""
                }`}
              >
                <img
                  src={item.product?.images?.[0]?.url || "/Images/coffee.png"}
                  alt={
                    item.product?.images?.[0]?.alt || item.product?.name || ""
                  }
                  className="size-10 md:size-16 object-cover rounded-lg"
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between w-full items-center">
                    <h4 className="w-full line-clamp-1 font-semibold">
                      {item.product?.name}
                    </h4>
                    <span>${item.unit_price}</span>
                    <button
                      className="text-gray-500 px-2"
                      onClick={() => removeFromCart(item.product_id)}
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
          </>
        )}
      </div>
    </div>
  );
}
