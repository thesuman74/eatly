import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionGuard } from "@/lib/rbac/actionGurad";
import { Permission } from "@/lib/rbac/permission";
import { ORDER_STATUS, OrderStatus } from "@/lib/types/order-types";
import { Loader2, Printer } from "lucide-react";

export function OrderStatusActions({
  onStatusChange,
  loading,
  currentStatus,
}: {
  onStatusChange: (s: OrderStatus) => void;
  loading?: boolean;
  currentStatus?: OrderStatus;
}) {
  return (
    <>
      {/* <Button variant="outline">
        <Printer size={14} />
      </Button> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
            variant="outline"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              currentStatus || "Status"
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40 ">
          <DropdownMenuItem
            onClick={(e) => {
              onStatusChange(ORDER_STATUS.PREPARING);
            }}
          >
            Preparing
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(e) => {
              onStatusChange(ORDER_STATUS.READY);
            }}
          >
            Ready
          </DropdownMenuItem>

          {/* <ActionGuard action={Permission.UPDATE_ORDER_STATUS}> */}
          <DropdownMenuItem
            onClick={(e) => {
              onStatusChange(ORDER_STATUS.DELIVERED);
            }}
          >
            Delivered
          </DropdownMenuItem>
          {/* </ActionGuard> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
