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
  CookingPot,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CounterTableFilters from "./CounterTableFilters";
import { useOrders, useUpdateOrderStatus } from "@/hooks/order/useOrders";
import { timeAgo } from "@/utils/time";
import { formatCreatedDate } from "@/utils/date";
import { OrderStatusActions } from "./OrderStatusActions";
import {
  ORDER_STATUS,
  OrderStatus,
  PAYMENT_STATUS,
} from "@/lib/types/order-types";
import { toast } from "react-toastify";
import { getOrderDetailsAPI } from "@/services/orderServices";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderWorkspace } from "@/stores/workspace/useOrderWorkspace";
import Link from "next/link";
import { getOrderAction, requiresPayment } from "@/lib/actions/orderActions";
import { useCartStore } from "@/stores/admin/useCartStore";
import { paymentPanelStore } from "@/stores/ui/paymentPanelStore";

export default function CounterTable() {
  const { openProductOrderSheet } = useOrderWorkspace();
  const { openpaymentPanelStore } = paymentPanelStore();

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
    updateOrderStatus.mutate({ id, status });
  };

  const acceptOrder = async (orderId: string) => {
    updateOrderStatus.mutate({ id: orderId, status: ORDER_STATUS.ACCEPTED });
  };

  const finishOrder = async (order: any, setLoading: (v: boolean) => void) => {
    try {
      setLoading(true);

      await queryClient.fetchQuery({
        queryKey: ["order-details", order.id],
        queryFn: () => getOrderDetailsAPI(order.id),
        staleTime: 60 * 1000,
      });

      if (requiresPayment(order)) {
        openProductOrderSheet(order.id);
      } else {
        updateOrderStatus.mutate({
          id: order.id,
          status: ORDER_STATUS.COMPLETED,
        });
      }
    } catch (err) {
      toast.error("Failed to finish order");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (
    order: any,
    setLoading: (v: boolean) => void
  ) => {
    const action = getOrderAction(order);

    if (action === "ACCEPT") {
      await acceptOrder(order.id);
    } else {
      await finishOrder(order, setLoading);
    }
  };
  const { setCurrentlyActiveOrderId } = useCartStore();

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

        {/*no  Orders */}

        {orders.length === 0 && (
          <div className="p-4 text-center h-64 md:h-96 flex flex-col space-y-4 items-center justify-center">
            <div className="">
              <CookingPot size={84} className="animate-bounce text-blue-600" />
            </div>
            <div className="flex flex-col w-auto space-y-4">
              <span className="text-sm text-gray-500 ">
                Create orders New Orders
              </span>
              <Button className="flex items-center justify-center space-x-4 py-8">
                <Link
                  href="order/new?type=onSite"
                  className="flex items-center justify-center space-x-4"
                >
                  <Plus size={60} />
                  <span className="text-xl">New Order</span>
                </Link>
              </Button>
            </div>
          </div>
        )}
        {orders.map((order, i) => {
          return (
            <div key={i}>
              {order.status !== ORDER_STATUS.COMPLETED && (
                <div
                  key={i}
                  className={`relative grid grid-cols-12 gap-4 p-4 hover:cursor-pointer  hover:bg-green-100 border items-center ${
                    order.status !== ORDER_STATUS.DRAFT && "bg-gray-50"
                  }`}
                  onClick={() => {
                    setCurrentlyActiveOrderId(order.id);
                    openProductOrderSheet(order.id);
                  }}
                >
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-[70%] w-1 ${
                      order.status === ORDER_STATUS.DRAFT
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    } bg-green-500 rounded" `}
                  />

                  {/* DATE + TIME */}
                  <div className="col-span-2 text-sm space-y-2">
                    <div className="flex items-center gap-1">
                      <span
                        className={
                          order.status === ORDER_STATUS.DRAFT
                            ? "text-orange-500"
                            : "text-green-600"
                        }
                      >
                        {order.order_number}
                      </span>
                      <span
                        className={`font-semibold text-md
                     ${
                       order.status === ORDER_STATUS.DRAFT
                         ? "text-orange-500"
                         : "text-green-600"
                     }`}
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
                        [ORDER_STATUS.DRAFT, "Preparing"].includes(order.status)
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
                    <div
                      className={`inline-block px-2 py-1 ${
                        order.payment_status === PAYMENT_STATUS.PAID
                          ? "bg-green-500"
                          : "bg-orange-400"
                      }  capitalize text-white rounded-full text-xs font-bold`}
                    >
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
                  <div className="col-span-3 flex justify-end items-center gap-2 text-sm">
                    {/* Cancel button */}
                    <Button
                      variant="outline"
                      className="border text-red-600 border-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation(); // <--- prevents row click
                      }}
                    >
                      {" "}
                      <X size={14} /> Cancel
                    </Button>

                    {/* Only show Status dropdown if not pending */}
                    {order.status !== ORDER_STATUS.DRAFT && (
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
                      onClick={(e) => {
                        e.stopPropagation(); // <--- prevents row click
                        openProductOrderSheet(order.id); // Step 1: open the ProductOrdersheet
                        openpaymentPanelStore(order.id);
                      }}
                    >
                      <DollarSign size={14} /> Pay
                    </Button>

                    {/* Accept / Finish button */}
                    <Button
                      className={`text-white ${
                        order.status === ORDER_STATUS.DRAFT
                          ? "bg-green-500"
                          : "bg-blue-600"
                      }`}
                      disabled={loadingOrderId === order.id}
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ Prevent row click from firing
                        handleOrderAction(order, (v) =>
                          setLoadingOrderId(v ? order.id : null)
                        );
                      }}
                    >
                      {loadingOrderId === order.id ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Check size={14} />
                      )}
                      {order.status === ORDER_STATUS.DRAFT
                        ? "Accept"
                        : "Finish"}
                    </Button>

                    {order.status === ORDER_STATUS.DRAFT && (
                      <MoreVertical
                        size={18}
                        className="cursor-pointer text-gray-500"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
