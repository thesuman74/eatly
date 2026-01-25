import { Check, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Order, ORDER_STATUS, OrderStatus } from "@/lib/types/order-types";
import { Table } from "@tanstack/react-table";

export type StatusFilter = OrderStatus | "all";

interface Props {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
  orders: { status: OrderStatus; total_amount: number }[];
  table?: Table<any>; // optional table instance for pagination
}

export default function CounterTableFilters({
  value,
  onChange,
  orders,
  table,
}: Props) {
  const isActive = (v: StatusFilter) =>
    value === v ? "bg-blue-200 text-blue-600" : "hover:border-accent";

  const totalOrders = orders.length;

  const count = (status: StatusFilter) => {
    return status === "all"
      ? totalOrders
      : orders.filter((o) => o.status === status).length;
  };

  const totalAmount = orders
    .filter((o) => value === "all" || o.status === value)
    .reduce((acc, o) => acc + o.total_amount, 0);

  return (
    <div className="flex justify-between w-full items-center border-b bg-secondary rounded-t-sm  px-4">
      {/* Left */}
      <div className="flex items-center gap-2 text-gray-500">
        <Filter size={18} />
        <span className="text-sm font-medium hidden md:block">Filter</span>

        <div className="flex gap-2 py-2">
          {/* ALL */}
          <Badge
            variant="outline"
            className={`cursor-pointer ${isActive("all")}`}
            onClick={() => onChange("all")}
          >
            {value === "all" && <Check size={14} className="mr-1" />}
            All
          </Badge>
          {/* PENDING */}
          {count(ORDER_STATUS.DRAFT) > 0 && (
            <Badge
              variant="outline"
              className={`cursor-pointer ${isActive(ORDER_STATUS.DRAFT)}`}
              onClick={() => onChange(ORDER_STATUS.DRAFT)}
            >
              Pending
              <Badge className="bg-yellow-500 mx-1 text-xs text-white">
                {count(ORDER_STATUS.DRAFT)}
              </Badge>
            </Badge>
          )}

          {/* ONGOING */}

          {count(ORDER_STATUS.PREPARING) > 0 && (
            <Badge
              variant="outline"
              className={`cursor-pointer ${isActive(ORDER_STATUS.PREPARING)}`}
              onClick={() => onChange(ORDER_STATUS.PREPARING)}
            >
              PREPARING
              <Badge className="bg-green-500 mx-1 text-xs text-white">
                {count(ORDER_STATUS.PREPARING)}
              </Badge>
            </Badge>
          )}

          {/* READY */}
          {count(ORDER_STATUS.READY) > 0 && (
            <Badge
              variant="outline"
              className={`cursor-pointer ${isActive(ORDER_STATUS.READY)}`}
              onClick={() => onChange(ORDER_STATUS.READY)}
            >
              Ready
              <Badge className="bg-green-500 mx-1 text-xs text-white">
                {count(ORDER_STATUS.READY)}
              </Badge>
            </Badge>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="text-xs sm:text-sm font-semibold ">
        Total: Rs {totalAmount}
      </div>

      {/* Pagination */}
      {table && (
        <div className="flex items-center justify-end gap-2 mt-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>

          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
