"use client";

import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { Grip } from "lucide-react";

interface SubItemProps {
  item: { id: string; name: string; price: string; image: string };
}

const SubItem = ({ item }: SubItemProps) => {
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
        <Grip />
      </span>
      <img
        src={item.image}
        alt={item.name}
        className="w-8 h-8 rounded-full mr-3"
      />
      <span className="flex-1">{item.name}</span>
      <span className="text-gray-500">{item.price}</span>
    </motion.div>
  );
};

export default SubItem;
