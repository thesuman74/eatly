"use client";

import { ProductTypes } from "@/lib/types/menu-types";
import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import {
  EllipsisVertical,
  Eye,
  EyeOffIcon,
  Grip,
  Layers2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import ProductOptions from "./ProductOptions";
import { toast } from "react-toastify";
import { useAdminProductStore } from "@/stores/admin-product-store";

interface SubItemProps {
  item: ProductTypes;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

const SubItem = ({
  item,
  onDelete,
  onDuplicate,
  onToggleVisibility,
}: SubItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
      className="p-2 border bg-white rounded-lg mb-2 flex items-center shadow-md"
    >
      <span {...attributes} {...listeners} className="cursor-grab mr-2">
        <Grip size={16} className="text-gray-500" />
      </span>
      <img
        src={item?.image?.url || "/Images/coffee.png"}
        alt={item.image?.alt}
        className="w-8 h-8 rounded-full mr-3"
      />
      <span className="flex-1 text-sm">{item.name}</span>

      <ProductOptions
        onToggleVisibility={() => onToggleVisibility(item.id)}
        onDuplicate={() => onDuplicate(item.id)}
        onDelete={() => onDelete(item.id)}
      />
    </motion.div>
  );
};

export default SubItem;
