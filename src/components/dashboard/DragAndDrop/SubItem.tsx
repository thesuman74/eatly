"use client";

import { ProductTypes } from "@/lib/types/menu-types";
import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { Grip } from "lucide-react";
import ProductOptions from "./ProductOptions";

import { Badge } from "@/components/ui/badge";

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

  console.log(item);
  return (
    <motion.div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
      className={`p-2 border bg-white rounded-lg mb-2 flex items-center shadow-md ${
        item.isVisible ? "bg-gray-100/10" : "bg-gray-100 opacity-80 shadow-none"
      }`}
    >
      <span {...attributes} {...listeners} className="cursor-grab mr-2">
        <Grip size={16} className="text-gray-500" />
      </span>
      <img
        src={
          item?.images?.find((img) => img.is_primary)?.url ||
          item?.images?.[0]?.url ||
          "/Images/coffee.png"
        }
        alt={
          item?.images?.find((img) => img.is_primary)?.alt ||
          item?.images?.[0]?.alt ||
          "Product image"
        }
        className="w-8 h-8 rounded-full mr-3"
      />

      <span className="flex-1 text-sm">{item.name}</span>
      {!item.isVisible && (
        <Badge className="bg-red-600 px-2 py-1 rounded-full text-xs text-white">
          Hidden
        </Badge>
      )}

      <ProductOptions
        onToggleVisibility={() => onToggleVisibility(item.id)}
        onDuplicate={() => onDuplicate(item.id)}
        onDelete={() => onDelete(item.id)}
      />
    </motion.div>
  );
};

export default SubItem;
