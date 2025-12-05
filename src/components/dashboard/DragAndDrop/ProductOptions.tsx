"use client";

import { Copy, EllipsisVertical, Eye, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductOptionsProps {
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
}

const ProductOptions = ({
  onDelete,
  onDuplicate,
  onToggleVisibility,
}: ProductOptionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-full  hover:bg-gray-200">
          <EllipsisVertical size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56  ">
        <DropdownMenuItem
          onClick={onToggleVisibility}
          className="flex items-center space-x-2 border-b-2 hover:cursor-pointer"
        >
          <Eye size={16} />
          <span>Product Visibility</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDuplicate}
          className="flex items-center space-x-2 border-b-2 hover:cursor-pointer"
        >
          <Copy size={16} />
          <span>Duplicate</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          className="flex items-center space-x-2 text-red-600  hover:cursor-pointer"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductOptions;
