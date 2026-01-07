import React from "react";
import { Clock, User, Timer, Check, UtensilsCrossed } from "lucide-react";
import { Order, OrderStatus } from "@/lib/types/order-types";
import { OrderStatusActions } from "@/components/order/OrderStatusActions";
import { timeAgo } from "@/utils/time";
import clsx from "clsx";

// Types based on your provided JSON
interface OrderItem {
  id: string;
  quantity: number;
  product_id: string;
}

interface KitchenCardItemProps {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const KitchenCardItem = ({ order, onStatusChange }: KitchenCardItemProps) => {
  const elapsed = (Date.now() - new Date(order.created_at).getTime()) / 1000;
  // Format the ISO timestamp to HH:mm
  const timeColor = clsx(
    "text-xs font-medium transition-colors",
    elapsed < 300 && "text-green-600",
    elapsed >= 300 && elapsed < 900 && "text-yellow-600",
    elapsed >= 900 && "text-red-600 animate-pulse"
  );

  return (
    <div
      className={`w-full max-w-[260px] rounded-lg overflow-hidden border m-3 shadow-sm ${
        order.status === "ready"
          ? "border-green-400 bg-green-50"
          : order.status === "preparing"
          ? "border-blue-400 bg-blue-50"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Header Section */}
      <div className="p-3 pt-10 relative">
        {/* Order Number Badge */}
        <div className="absolute -top-1 -left-1 bg-[#400D0D] text-white px-3 py-1 rounded-br-2xl flex items-center gap-1">
          <UtensilsCrossed size={16} />
          <span className="font-bold text-lg leading-none">
            #{order.order_number}
          </span>
        </div>

        {/* User and Countdown Row */}
        <div className="flex items-center justify-between text-gray-800 space-x-2">
          <div className="flex items-center gap-1 font-semibold text-[14px]">
            <User size={16} strokeWidth={2.5} />
            <span className="capitalize line-clamp-1">
              {order?.customer_name || order?.id}
            </span>
          </div>

          <div className={`flex items-center text-xs gap-1 ${timeColor}`}>
            <Clock size={14} /> {timeAgo(order.created_at)}
          </div>
        </div>
      </div>

      {/* Body: Items List */}
      <div className="p-4">
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex gap-2 text-[14px] font-semibold text-gray-900">
                <span className="min-w-[18px]">{item.quantity}</span>
                <span className="capitalize tracking-tight">
                  {item.product_name}
                </span>
              </div>
              <div className="w-6 h-6 border-2 border-gray-300 rounded-md shadow-sm" />
            </div>
          ))}
        </div>

        {/* Dashed Separator */}
        <div className="border-t-2 border-dashed border-gray-200 my-4" />

        <div className="flex flex-col gap-2">
          <OrderStatusActions
            onStatusChange={(status) => onStatusChange(order.id, status)}
            loading={false}
            currentStatus={order.status}
          />
          {/* Footer Action: Blue Outlined Button */}
          <button className="w-full py-2.5 border-2 border-[#2196F3] text-[#2196F3] rounded-lg font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-blue-50 transition-colors active:scale-[0.97]">
            <Check size={20} strokeWidth={3} />
            Mark all prepared
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenCardItem;
