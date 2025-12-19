import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";

export function OrderOverflowMenu({
  onCancel,
  onDelete,
}: {
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => e.stopPropagation()}
        >
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
          <Trash2 size={16} />
          Delete Order
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:text-red-600 hover:cursor-pointer "
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
        >
          <span className="mx-auto">Cancel Order</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
