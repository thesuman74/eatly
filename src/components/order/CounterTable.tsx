"use client";
import { useState } from "react";
import CounterTableFilters, { StatusFilter } from "./CounterTableFilters";
import { useOrders, useUpdateOrderStatus } from "@/hooks/order/useOrders";
import { useOrderWorkspace } from "@/stores/workspace/useOrderWorkspace";
import { ORDER_STATUS, OrderStatus } from "@/lib/types/order-types";
import { toast } from "react-toastify";
import { deleteOrderItemAPI } from "@/services/orderServices";
import { useQueryClient } from "@tanstack/react-query";
import OrdersTable from "./OrderTable";
import { paymentPanelStore } from "@/stores/ui/paymentPanelStore";

export default function CounterTable() {
  const { openProductOrderSheet } = useOrderWorkspace();
  const queryClient = useQueryClient();
  const { data: orders = [] } = useOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { openpaymentPanelStore } = paymentPanelStore();

  const filteredData = orders.filter((order) => {
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateOrderStatus.mutate(
      { id, status },
      { onError: () => toast.error("Failed to update status") }
    );
  };

  const acceptOrder = (id: string) =>
    handleStatusChange(id, ORDER_STATUS.ACCEPTED);
  const finishOrder = (order: any) =>
    handleStatusChange(order.id, ORDER_STATUS.COMPLETED);
  const cancelOrder = (id: string) =>
    handleStatusChange(id, ORDER_STATUS.CANCELLED);

  const deleteOrder = async (id: string) => {
    try {
      await deleteOrderItemAPI(id);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch {
      toast.error("Failed to delete order");
    }
  };

  return (
    <div>
      <CounterTableFilters
        value={statusFilter}
        onChange={setStatusFilter}
        orders={orders}
      />
      <OrdersTable
        orders={filteredData}
        onAccept={acceptOrder}
        onFinish={finishOrder}
        onPay={(orderId: string) => {
          openProductOrderSheet(orderId);
          openpaymentPanelStore(orderId);
        }}
        onStatusChange={handleStatusChange}
        onCancel={cancelOrder}
        onDelete={deleteOrder}
        openProductOrderSheet={openProductOrderSheet}
      />
    </div>
  );
}
