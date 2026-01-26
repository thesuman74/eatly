"use client";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { OrderPayment } from "@/lib/types/order-types";

type PaymentListProps = {
  payments: OrderPayment[];
  handleRefundPayment: (paymentId: string) => void;
};

export const PaymentList: React.FC<PaymentListProps> = ({
  payments,
  handleRefundPayment,
}) => {
  if (!payments || payments.length === 0) return null;

  // Check if any refund exists
  const hasRefund = payments.some((p) => p.payment_status === "refunded");

  const totalPaid = payments
    .filter((p) => p.payment_status === "paid")
    .reduce((acc, p) => acc + p.amount_paid, 0);

  return (
    <div className="flex flex-col p-4 space-y-4 ">
      {/* Total Paid Header */}
      <div className="flex items-center justify-between bg-card border p-4 rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-700 dark:text-white">
            Total
          </span>
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Paid
          </span>
        </div>
        <span className="text-xl font-bold  ">Rs {totalPaid}</span>
      </div>

      {/* Payment Cards */}
      {payments.map((p) => {
        const [showMenu, setShowMenu] = useState(false);
        const isRefunded = p.payment_status === "refunded";

        return (
          <div
            key={p.id}
            className="bg-card p-4 rounded-lg shadow flex justify-around items-center relative"
          >
            <div className="text-sm md:text-md">
              <div className=" text-gray-500">{p.method}</div>
              <div className=" font-semibold ">Rs {p.amount_paid}</div>
            </div>

            <div className="text-sm text-gray-400">
              {new Date(p.created_at).toLocaleString()}
              <div className="text-gray-500 text-xs pt-2">
                <span className="block">Items: Rs {p.amount_paid - p.tip}</span>
                <span className="block">Tip: Rs {p.tip}</span>
                {isRefunded && (
                  <span className="block text-red-500">Refunded</span>
                )}
              </div>
            </div>

            {/* 3-dot button: hide if any refund exists */}
            {!hasRefund && !isRefunded && (
              <div className="relative ml-2">
                <button
                  className="p-1 hover:bg-gray-200 rounded-full"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <MoreHorizontal size={16} />
                </button>

                {/* Dropdown menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-28 bg-secondary border rounded shadow z-10">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-secondary-foreground text-sm text-red-500"
                      onClick={() => handleRefundPayment(p.id)}
                    >
                      Refund
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
