import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Printer } from "lucide-react";

export function OrderStatusActions({
  onStatusChange,
}: {
  onStatusChange: (s: string) => void;
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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
