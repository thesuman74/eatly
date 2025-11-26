"use client";

import { useState } from "react";
import { Copy, EllipsisVertical, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button"; // optional styling
import { toast } from "react-toastify";

interface CategoryOptionsProps {
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
}

const CategoryOptions = ({
  onDelete,
  onDuplicate,
  onToggleVisibility,
}: CategoryOptionsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Ellipsis icon button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        <EllipsisVertical />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 p-2  bg-white border  shadow-lg rounded-md z-50">
          <button
            onClick={() => {
              onToggleVisibility();
              setOpen(false);
            }}
            className="w-full flex space-x-3 border-b border-gray-300 text-left px-4 py-2 hover:bg-gray-100"
          >
            <Eye />
            <span>Product Visibility</span>
          </button>
          <button
            onClick={() => {
              onDuplicate();
              setOpen(false);
            }}
            className="w-full flex space-x-3 text-left border-b border-gray-300 px-4 py-2 hover:bg-gray-100"
          >
            <Copy />
            <span>Duplicate</span>
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="w-full flex space-x-3 text-left px-4 border-b border-gray-300 py-2 text-red-600 hover:bg-red-100"
          >
            <Trash2 /> <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryOptions;
