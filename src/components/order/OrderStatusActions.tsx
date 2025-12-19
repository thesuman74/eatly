import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ORDER_STATUS, OrderStatus } from "@/lib/types/order-types";
import { Printer } from "lucide-react";

export function OrderStatusActions({
  onStatusChange,
}: {
  onStatusChange: (s: OrderStatus) => void; // <-- use OrderStatus here
}) {
  return (
    <>
      <Button variant="outline">
        <Printer size={14} />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
            variant="outline"
          >
            Status
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(ORDER_STATUS.PREPARING);
            }}
          >
            Preparing
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();

              onStatusChange(ORDER_STATUS.READY);
            }}
          >
            Ready
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();

              onStatusChange(ORDER_STATUS.DELIVERED);
            }}
          >
            Delivered
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(ORDER_STATUS.CANCELLED);
            }}
          >
            Cancelled
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
