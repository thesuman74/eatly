import React from "react";
import { Clock, User, Timer, Check, UtensilsCrossed } from "lucide-react";

// Types based on your provided JSON
interface OrderItem {
  id: string;
  quantity: number;
  product_id: string;
}

interface KitchenOrder {
  order_number: number;
  customer_name: string;
  created_at: string;
  items: OrderItem[];
}

const KitchenCardItem = ({ order }: { order: KitchenOrder }) => {
  // Format the ISO timestamp to HH:mm
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="w-full max-w-[400px] bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm font-sans">
      {/* Header Section: Light Pink Background */}
      <div className="bg-[#FAD4D4] p-4 pt-12 relative">
        {/* Order Number Badge: Dark Maroon */}
        <div className="absolute top-0 left-0 bg-[#400D0D] text-white px-4 py-1.5 rounded-br-2xl flex items-center gap-2">
          <UtensilsCrossed size={18} />
          <span className="font-bold text-xl leading-none">
            #{order.order_number}
          </span>
        </div>

        {/* User, Time, and Countdown Row */}
        <div className="flex items-center justify-between text-[#400D0D] space-x-4">
          <div className="flex items-center gap-1.5 font-bold text-[15px]">
            <User size={18} strokeWidth={2.5} />
            <span className="capitalize">Suman Adhikari</span>
          </div>

          <div className="bg-[#FF4D4D] text-white px-3 py-1 rounded-full flex items-center gap-1 text-[13px] font-black shadow-sm">
            <Timer size={16} strokeWidth={3} />
            <span>30:00 +</span>
          </div>
        </div>
      </div>

      {/* Body: Items List */}
      <div className="p-5">
        <div className="space-y-5">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex gap-4 text-xl font-bold text-gray-900">
                <span className="min-w-[20px]">{item.quantity}</span>
                <span className="capitalize tracking-tight">
                  {/* Mocking the name from ID for visual accuracy */}
                  {item.product_id.includes("6de") ? "Masala Tea" : "Lemon Tea"}
                </span>
              </div>
              {/* Custom Checkbox Placeholder */}
              <div className="w-7 h-7 border-2 border-gray-300 rounded-md shadow-sm" />
            </div>
          ))}
        </div>

        {/* Dashed Separator */}
        <div className="border-t-2 border-dashed border-gray-200 my-6" />

        {/* Footer Action: Blue Outlined Button */}
        <button className="w-full py-3.5 border-2 border-[#2196F3] text-[#2196F3] rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors active:scale-[0.98]">
          <Check size={28} strokeWidth={3} />
          Mark all prepared
        </button>
      </div>
    </div>
  );
};

export default KitchenCardItem;
