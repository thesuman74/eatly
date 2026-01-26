import { CancelOrderButton } from "@/app/dashboard/[restaurantId]/order/_components/CancelOrderButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, CircleX, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

export function OrderOverflowMenu({
  onCancel,
  onDelete,
  onAccept,
  orderId,
}: {
  onCancel: () => void;
  onDelete: () => void;
  onAccept: () => void;
  orderId: string;
}) {
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className=" size-6 md:size-auto"
            variant="outline"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="hover:cursor-pointer  block sm:hidden"
            onClick={(e) => {
              e.stopPropagation();
              onAccept();
            }}
          >
            <span className=" space-x-2 flex items-center">
              <Check size={16} />
              <span>Accept Order</span>
            </span>
          </DropdownMenuItem>
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
