import { Check, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Order, ORDER_STATUS, OrderStatus } from "@/lib/types/order-types";

export type StatusFilter = OrderStatus | "all";

interface Props {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
  orders: { status: OrderStatus; total_amount: number }[];
}

export default function CounterTableFilters({
  value,
  onChange,
  orders,
}: Props) {
  const isActive = (v: StatusFilter) =>
    value === v ? "bg-blue-200 text-blue-600" : "hover:bg-gray-100";

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
    <div className="flex justify-between w-full items-center border-b bg-white mt-8 px-4">
      {/* Left */}
      <div className="flex items-center gap-2 text-gray-500">
        <Filter size={18} />
        <span className="text-sm font-medium">Filter</span>

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

          {/* ONGOING */}
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
        </div>
      </div>

      {/* Right */}
      <div className="text-sm font-semibold text-gray-700">
        Total: Rs {totalAmount}
      </div>
    </div>
  );
}
