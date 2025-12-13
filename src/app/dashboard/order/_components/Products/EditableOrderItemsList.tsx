"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";

interface ProductImage {
  url: string;
  alt?: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images?: ProductImage[];
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string | null;
  product: Product | null;
}

interface EditableOrderItemsListProps {
  itemsWithDetails: OrderItem[];
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  paymentStatus?: string;
}

export default function EditableOrderItemsList({
  itemsWithDetails,
  onUpdateQuantity,
  onRemoveItem,
  paymentStatus = "Pending",
}: EditableOrderItemsListProps) {
  const [items, setItems] = useState(itemsWithDetails || []);


  // Handle quantity update locally and call callback
  const updateQuantity = (itemId: string, quantity: number) => {
    const updated = items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setItems(updated);
    onUpdateQuantity?.(itemId, quantity);
  };

  const removeItem = (itemId: string) => {
    const updated = items.filter((item) => item.id !== itemId);
    setItems(updated);
    onRemoveItem?.(itemId);
  };

  const cartTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.total_price, 0),
    [items]
  );

  return (
    <>
      <div className="w-full max-w-md bg-white border rounded shadow-md flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b bg-blue-500 p-2 text-white">
          <span className="font-bold text-lg">+ Products</span>
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 min-h-[250px] max-h-[400px]">
          {items.map((item) => (
            <div
              key={item.id}
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
                    onClick={() => removeItem(item.id)}
                  >
                    <X />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
