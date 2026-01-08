import {
  Order,
  ORDER_STATUS,
  OrderActionState,
  OrderActionType,
  OrderStatus,
} from "@/lib/types/order-types";
import KitchenCardItem from "./KitchenItemCard";
import CounterTableFilters, {
  StatusFilter,
} from "@/components/order/CounterTableFilters";
import { useState } from "react";
import { useUpdateOrderStatus } from "@/hooks/order/useOrders";

interface KitchenPageProps {
  orderData: Order[];
}

export default function KitchenPage({ orderData }: KitchenPageProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredData = orderData.filter((order) => {
    // Hide COMPLETED or CANCELLED orders
    if (
      order.status === ORDER_STATUS.COMPLETED ||
      order.status === ORDER_STATUS.CANCELLED ||
      order.status === ORDER_STATUS.DELIVERED ||
      order.status === ORDER_STATUS.DRAFT
    ) {
      return false;
    }

    // Show all if "all" filter is selected
    if (statusFilter === "all") return true;

    // Otherwise, match the selected status
    return order.status === statusFilter;
  });

  const updateOrderStatus = useUpdateOrderStatus();
  const [actionState, setActionState] = useState<OrderActionState>({
    orderId: null,
    type: null,
  });

  const handleStatusChange = (
    id: string,
    status: OrderStatus,
    type: OrderActionType
  ) => {
    setActionState({ orderId: id, type });

    updateOrderStatus.mutate(
      { id, status },
      {
        onSettled: () => {
          setActionState({ orderId: null, type: null });
        },
      }
    );
  };
  return (
    <>
      <div className="bg-background min-h-screen  flex flex-col">
        <div className="mb-4">
          <CounterTableFilters
            value={statusFilter}
            onChange={setStatusFilter}
            orders={orderData}
          />
        </div>
        {/* Filters row */}

        {/* Cards container */}
        <div className="flex flex-wrap justify-start gap-4">
          {filteredData?.map((order, index) => (
            <KitchenCardItem
              order={order}
              key={index}
              onStatusChange={(id, status) =>
                handleStatusChange(id, status, "status")
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
