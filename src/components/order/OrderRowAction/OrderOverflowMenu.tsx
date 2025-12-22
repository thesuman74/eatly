import { CancelOrderButton } from "@/app/dashboard/order/_components/cancelOrder/CancelOrderButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleX, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

export function OrderOverflowMenu({
  onCancel,
  onDelete,
  orderId,
}: {
  onCancel: () => void;
  onDelete: () => void;
  orderId: string;
}) {
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" onClick={(e) => e.stopPropagation()}>
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="hover:cursor-pointer hover:text-red-700 "
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <span className="text-red-500 space-x-2 flex items-center">
              <Trash2 size={16} />
              <span>Delete Order</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              setCancelOpen(true); // open the dialog
            }}
          >
            <CircleX size={16} className="mr-2" />
            Cancel Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Render the CancelOrderButton outside the dropdown */}{" "}
      <CancelOrderButton
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        orderId={orderId}
        onCancelSuccess={onDelete}
      />
    </>
  );
}
