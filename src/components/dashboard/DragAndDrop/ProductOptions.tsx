"use client";

import { Copy, EllipsisVertical, Eye, PenBoxIcon, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProductSheet } from "@/app/stores/useProductSheet";

interface ProductOptionsProps {
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;

  productId: string;
  categoryId: string;
}

const ProductOptions = ({
  onDelete,
  onDuplicate,
  onToggleVisibility,

  productId,
  categoryId,
}: ProductOptionsProps) => {
  const { openEditSheet } = useProductSheet(); // ✅ Changed

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
          onClick={() => openEditSheet(productId, categoryId)} // ✅ Changed
          className="flex items-center space-x-2 border-b-2 hover:cursor-pointer"
        >
          <PenBoxIcon size={16} />
          <span>Edit</span>
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
