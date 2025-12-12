import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderStatus } from "@/lib/types/order-types";
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
          <Button variant="outline">Status</Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => onStatusChange("Ready")}>
            Ready
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("Delivered")}>
            Delivered
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("Cancelled")}>
            Cancelled
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
