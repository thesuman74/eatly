"use client";
import { useState } from "react";
import CounterTableFilters, { StatusFilter } from "./CounterTableFilters";
import { useOrders, useUpdateOrderStatus } from "@/hooks/order/useOrders";
import { useOrderWorkspace } from "@/stores/workspace/useOrderWorkspace";
import {
  ORDER_STATUS,
  OrderActionState,
  OrderActionType,
  OrderStatus,
} from "@/lib/types/order-types";
import { toast } from "react-toastify";
import { deleteOrderItemAPI } from "@/services/orderServices";
import { useQueryClient } from "@tanstack/react-query";
import OrdersTable from "./OrderTable";
import { paymentPanelStore } from "@/stores/ui/paymentPanelStore";
import { requiresPayment } from "@/lib/actions/orderActions";
import { OrderTableSkeleton } from "@/app/dashboard/[restaurantId]/order/_components/OrderTableSkeleton";

export default function CounterTable() {
  const { openProductOrderSheet } = useOrderWorkspace();
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading: isLoadingOrders } = useOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { openpaymentPanelStore } = paymentPanelStore();

  const filteredData = orders
    .filter((order) => {
      // Hide COMPLETED or CANCELLED orders
      if (
        order.status === ORDER_STATUS.COMPLETED ||
        order.status === ORDER_STATUS.CANCELLED
      ) {
        return false;
      }

      // Show all if "all" filter is selected
      if (statusFilter === "all") return true;

      // Otherwise, match the selected status
      return order.status === statusFilter;
    })
    // .sort((a, b) => {
    //   // Sort descending by order_number (latest first)
    //   // If you have a date field like created_at, use that instead
    //   return Number(b.order_number) - Number(a.order_number);

    .sort((a, b) => {
      // Sort descending by created_at (latest first)
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  const [actionState, setActionState] = useState<OrderActionState>({
    orderId: null,
    type: null,
  });

  const handleStatusChange = (
    id: string,
    status: OrderStatus,
    type: OrderActionType,
  ) => {
    setActionState({ orderId: id, type });

    updateOrderStatus.mutate(
      { id, status },
      {
        onSettled: () => {
          setActionState({ orderId: null, type: null });
        },
      },
    );
  };

  const acceptOrder = (id: string) => {
    console.log("order accepted");
    handleStatusChange(id, ORDER_STATUS.ACCEPTED, "accept");
  };

  const finishOrder = (order: any) => {
    if (requiresPayment(order)) {
      openProductOrderSheet(order.id);
      openpaymentPanelStore(order.id);
    } else {
      handleStatusChange(order.id, ORDER_STATUS.COMPLETED, "finish");
    }
  };

  const cancelOrder = (id: string) =>
    handleStatusChange(id, ORDER_STATUS.CANCELLED, "cancel");

  const deleteOrder = async (id: string) => {
    try {
      await deleteOrderItemAPI(id);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch {
      toast.error("Failed to delete order");
    }
  };

  return (
    <div className="mt-6">
      <CounterTableFilters
        value={statusFilter}
        onChange={setStatusFilter}
        orders={orders}
      />
      {isLoadingOrders ? (
        <OrderTableSkeleton />
      ) : (
        <OrdersTable
          orders={filteredData}
          onAccept={acceptOrder}
          onFinish={finishOrder}
          onPay={(orderId: string) => {
            openProductOrderSheet(orderId);
            openpaymentPanelStore(orderId);
          }}
          onStatusChange={(id, status) =>
            handleStatusChange(id, status, "status")
          }
          actionState={actionState}
          onCancel={cancelOrder}
          onDelete={deleteOrder}
          openProductOrderSheet={openProductOrderSheet}
        />
      )}
    </div>
  );
}
