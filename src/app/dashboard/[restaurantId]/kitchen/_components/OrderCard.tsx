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
import { TablePagination } from "@/components/Pagination"; // import your pagination component

interface KitchenPageProps {
  orderData: Order[];
}

export default function KitchenPage({ orderData }: KitchenPageProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10); // default rows per page

  const filteredData = orderData.filter((order) => {
    if (
      order.status === ORDER_STATUS.COMPLETED ||
      order.status === ORDER_STATUS.CANCELLED ||
      order.status === ORDER_STATUS.DELIVERED ||
      order.status === ORDER_STATUS.DRAFT
    ) {
      return false;
    }

    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  const paginatedData = filteredData.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize,
  );

  const updateOrderStatus = useUpdateOrderStatus();
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

  return (
    <>
      <div className="bg-background  min-h-screen flex flex-col mb-10">
        <div className="mb-4">
          <CounterTableFilters
            value={statusFilter}
            onChange={setStatusFilter}
            orders={orderData}
          />
        </div>

        {/* Cards container */}
        <div className="flex flex-wrap mx-auto justify-start gap-4">
          {paginatedData?.map((order) => (
            <KitchenCardItem
              order={order}
              key={order.id} // use stable id
              onStatusChange={(id, status) =>
                handleStatusChange(id, status, "status")
              }
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <TablePagination
            pageIndex={pageIndex}
            pageCount={Math.ceil(filteredData.length / pageSize)}
            setPageIndex={setPageIndex}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </div>
      </div>
    </>
  );
}
