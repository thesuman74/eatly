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
import CounterTableFilters, { StatusFilter } from "./CounterTableFilters";
import { useOrders, useUpdateOrderStatus } from "@/hooks/order/useOrders";
import { getElapsedSeconds, timeAgo } from "@/utils/time";
import { formatCreatedDate } from "@/utils/date";
import { OrderStatusActions } from "./OrderStatusActions";
import {
  ORDER_STATUS,
  OrderStatus,
  PAYMENT_STATUS,
} from "@/lib/types/order-types";
import { toast } from "react-toastify";
import {
  deleteOrderItemAPI,
  getOrderDetailsAPI,
} from "@/services/orderServices";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderWorkspace } from "@/stores/workspace/useOrderWorkspace";
import Link from "next/link";
import { requiresPayment } from "@/lib/actions/orderActions";
import { useCartStore } from "@/stores/admin/useCartStore";
import { paymentPanelStore } from "@/stores/ui/paymentPanelStore";
import { useSecondTicker } from "@/hooks/useSecondTicker";
import clsx from "clsx";
import { OrderRowActions } from "./OrderRowAction/OrderRowActions";
import { Badge } from "../ui/badge";

export default function CounterTable() {
  const { openProductOrderSheet } = useOrderWorkspace();
  const { openpaymentPanelStore } = paymentPanelStore();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const queryClient = useQueryClient();

  const { data: orders = [], error } = useOrders();
  console.log("orders form counter table", orders);

  const updateOrderStatus = useUpdateOrderStatus();

  const filteredData = orders.filter((order) => {
    if (statusFilter === "all") {
      return true;
    }
    switch (statusFilter) {
      case ORDER_STATUS.DRAFT:
        return order.status === ORDER_STATUS.DRAFT;
      case ORDER_STATUS.ACCEPTED:
        return order.status === ORDER_STATUS.ACCEPTED;
      case ORDER_STATUS.READY:
        return order.status === ORDER_STATUS.READY;
      case ORDER_STATUS.DELIVERED:
        return order.status === ORDER_STATUS.DELIVERED;

      default:
        return true;
    }
  });

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setActionState({ orderId: id, type: "status" });

    updateOrderStatus.mutate(
      { id, status },
      {
        onError: () => {
          toast.error("Failed to update order status");
        },
        onSettled: () => {
          setActionState({ orderId: null, type: null });
        },
      }
    );
  };

  const acceptOrder = async (orderId: string) => {
    setActionState({ orderId, type: "accept" });

    try {
      await updateOrderStatus.mutateAsync({
        id: orderId,
        status: ORDER_STATUS.ACCEPTED,
      });
    } catch (error) {
      toast.error("Failed to accept order");
    } finally {
      setActionState({ orderId: null, type: null });
    }
  };

  const finishOrder = async (order: any) => {
    setActionState({ orderId: order.id, type: "finish" });

    try {
      // await queryClient.fetchQuery({
      //   queryKey: ["order-details", order.id],
      //   queryFn: () => getOrderDetailsAPI(order.id),
      //   staleTime: 60 * 1000,
      // });

      if (requiresPayment(order)) {
        setActionState({ orderId: order.id, type: "pay" });

        openProductOrderSheet(order.id);
      } else {
        // ✅ Wait for mutation to complete
        await updateOrderStatus.mutateAsync({
          id: order.id,
          status: ORDER_STATUS.COMPLETED,
        });
      }
    } catch (err) {
      toast.error("Failed to finish order");
    } finally {
      setActionState({ orderId: null, type: null });
    }
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus.mutate({
      id: orderId,
      status: ORDER_STATUS.CANCELLED,
    });
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteOrderItemAPI(orderId);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const { setCurrentlyActiveOrderId } = useCartStore();

  // useSecondTicker(); // 👈 this enables live updates
  type OrderActionType =
    | "accept"
    | "finish"
    | "status"
    | "pay"
    | "cancel"
    | "delete"
    | null;

  type OrderActionState = {
    orderId: string | null;
    type: OrderActionType;
  };

  const [actionState, setActionState] = useState<OrderActionState>({
    orderId: null,
    type: null,
  });

  const isLoading = (orderId: string, type: OrderActionType) =>
    actionState.orderId === orderId && actionState.type === type;

  return (
    <>
      <div>
        <CounterTableFilters
          value={statusFilter}
          onChange={setStatusFilter}
          orders={orders}
        />
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
        {filteredData.map((order, i) => {
          const elapsed = getElapsedSeconds(order?.created_at);

          const timeColor = clsx(
            "text-xs font-medium transition-colors",
            elapsed < 300 && "text-green-600", // < 5 min
            elapsed >= 300 && elapsed < 900 && "text-yellow-600", // 5–15 min
            elapsed >= 900 && "text-red-600 animate-pulse " // > 15 min
          );
          return (
            <div key={i}>
              {order.status !== ORDER_STATUS.COMPLETED && (
                <div
                  key={i}
                  className={`relative grid grid-cols-12 gap-4 p-4 hover:cursor-pointer   hover:bg-blue-50 border items-center ${
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
                    <div
                      className={`flex items-center  text-xs gap-1 ${timeColor}`}
                    >
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
                  <div className="col-span-2 text-sm  space-y-2 ">
                    <div
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        [ORDER_STATUS.DRAFT, "Preparing"].includes(order.status)
                          ? "bg-green-300 text-black/60"
                          : "bg-blue-300 text-black/60"
                      }`}
                    >
                      {order.status.toLocaleUpperCase()}
                    </div>
                    <div className="text-xs ml-4 text-gray-500">
                      {order.order_source.toUpperCase()}
                    </div>
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
                    <OrderRowActions
                      order={order}
                      loading={{
                        accept: isLoading(order.id, "accept"),
                        finish: isLoading(order.id, "finish"),
                        status: isLoading(order.id, "status"),
                        pay: isLoading(order.id, "pay"),
                      }}
                      onAccept={() => acceptOrder(order.id)}
                      onFinish={() => finishOrder(order)}
                      onPay={() => {
                        openProductOrderSheet(order.id);
                        openpaymentPanelStore(order.id);
                      }}
                      onStatusChange={(status) =>
                        handleStatusChange(order.id, status)
                      }
                      onCancel={() => cancelOrder(order.id)}
                      onDelete={() => deleteOrder(order.id)}
                    />
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
