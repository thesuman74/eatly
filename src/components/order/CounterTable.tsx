"use client";

import {
  Check,
  X,
  DollarSign,
  Printer,
  MoreVertical,
  Clock,
  CalendarDays,
  User2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CounterTableFilters from "./CounterTableFilters";
import { useOrders, useUpdateOrderStatus } from "@/hooks/order/useOrders";
import { timeAgo } from "@/utils/time";
import { formatCreatedDate } from "@/utils/date";
import { OrderStatusActions } from "./OrderStatusActions";
import { OrderStatus } from "@/lib/types/order-types";
import { toast } from "react-toastify";
import { useOrderSheet } from "@/app/stores/useOrderSheet";
import { getOrderDetailsAPI } from "@/services/orderServices";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderWorkspace } from "@/stores/workspace/useOrderWorkspace";

export default function CounterTable() {
  const { openProductOrderSheet } = useOrderWorkspace();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, error } = useOrders();
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const prefetchOrderDetails = (orderId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["order-details", orderId],
      queryFn: () => getOrderDetailsAPI(orderId),
      staleTime: 1000 * 60, // 1 min
    });
  };

  const updateOrderStatus = useUpdateOrderStatus();

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateOrderStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast.success("Order status updated successfully!");
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to update order status");
        },
      }
    );
  };

  const [open, setOpen] = useState(false);
  return (
    <>
      <div>
        <CounterTableFilters />
      </div>
      <div className="bg-white rounded-md shadow overflow-hidden ">
        {/* Header */}
        <div
          className="grid grid-cols-12 gap-4 p-2 px-4 text-xs font-semibold text-gray-500 bg-gray-100 
      "
        >
          <div className="col-span-2">DATE</div>
          <div className="col-span-2">STATUS</div>
          <div className="col-span-2">TOTAL</div>
          <div className="col-span-3">CLIENT</div>
          <div className="col-span-3 text-center">ACTIONS</div>
        </div>

        {/* Orders */}
        {orders.map((order, i) => {
          return (
            <div
              key={i}
              className={`relative grid grid-cols-12 gap-4 p-4 border items-center ${
                order.status !== "Pending" && "bg-gray-50"
              }`}
            >
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-[70%] w-1 ${
                  order.status === "Pending" ? "bg-yellow-500" : "bg-green-500"
                } bg-green-500 rounded" `}
              />

              {/* DATE + TIME */}
              <div className="col-span-2 text-sm space-y-2">
                <div className="flex items-center gap-1">
                  <span
                    className={
                      order.status === "Pending"
                        ? "text-orange-500"
                        : "text-green-600"
                    }
                  >
                    {order.order_number}
                  </span>
                  <span
                    className={
                      order.status === "Pending"
                        ? "text-orange-500"
                        : "text-green-600"
                    }
                  >
                    {"#" + order?.order_type}
                  </span>
                </div>
                <div className="flex items-center text-red-500 text-xs gap-1">
                  <Clock size={14} />
                  {/* {order.updated_at} */}
                  {timeAgo(order.created_at)}
                </div>
                <div className="flex items-center text-xs text-gray-500 gap-1">
                  <CalendarDays size={14} />
                  {/* {order.created_at} */}
                  {formatCreatedDate(order.created_at)}
                </div>
              </div>

              {/* STATUS */}
              <div className="col-span-2 text-sm space-y-2">
                <div
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    ["Pending", "Preparing"].includes(order.status)
                      ? "bg-green-300 text-black/60"
                      : "bg-blue-300 text-black/60"
                  }`}
                >
                  {order.status.toLocaleUpperCase()}
                </div>
                {/* <div className="text-xs text-gray-500">POS </div> */}
              </div>

              {/* TOTAL */}
              <div className="col-span-2 text-sm font-semibold space-y-2">
                <div className="inline-block px-2 py-1 bg-orange-400 capitalize text-white rounded-full text-xs font-bold">
                  {order.payment_status}
                </div>
                <div>Rs {order.total_amount}</div>
              </div>

              {/* CLIENT */}
              <div className="col-span-3 text-sm ">
                <div className="flex items-center text-xs text-gray-500 gap-1">
                  <User2 size={14} />
                  {order.customer_name}
                </div>
              </div>

              {/* ACTIONS */}
              {/* ACTIONS */}
              <div className="col-span-3 flex justify-end items-center gap-2 text-sm">
                {/* Cancel button */}
                <Button
                  variant="outline"
                  className="border text-red-600 border-red-600 hover:bg-red-50"
                >
                  <X size={14} /> Cancel
                </Button>

                {/* Only show Status dropdown if not pending */}
                {order.status !== "Pending" && (
                  <OrderStatusActions
                    onStatusChange={(status) =>
                      handleStatusChange(order.id, status)
                    }
                  />
                )}

                {/* Pay button */}
                <Button
                  variant="outline"
                  className="border text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <DollarSign size={14} /> Pay
                </Button>

                {/* Accept / Finish button */}
                <Button
                  className={`text-white ${
                    order.status === "Pending" ? "bg-green-500" : "bg-blue-600"
                  }`}
                  disabled={loadingOrderId === order.id}
                  onClick={async () => {
                    if (order.status === "Pending") {
                      handleStatusChange(order.id, "Preparing");
                    } else if (order.payment_status === "Unpaid") {
                      try {
                        setLoadingOrderId(order.id); // start loader

                        // fetch data and wait
                        await queryClient.fetchQuery({
                          queryKey: ["order-details", order.id],
                          queryFn: () => getOrderDetailsAPI(order.id),
                          staleTime: 1000 * 60, // 1 min
                        });

                        // open sheet only after data is fetched
                        openProductOrderSheet(order.id);
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setLoadingOrderId(null); // stop loader
                      }
                    }
                  }}
                >
                  {loadingOrderId === order.id ? (
                    <span className="animate-spin">
                      <Loader2 />
                    </span> // loader icon or spinner
                  ) : (
                    <>
                      <Check size={14} />{" "}
                    </>
                  )}
                  {order.status === "Pending" ? "Accept" : "Finish"}
                </Button>

                {order.status === "Pending" && (
                  <MoreVertical
                    size={18}
                    className="cursor-pointer text-gray-500"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
