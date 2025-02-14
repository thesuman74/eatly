"use client";

import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { useState } from "react";
import SubItemList from "./SubItemList";
import {
  Grip,
  ChevronDown,
  ChevronRight,
  EllipsisVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductAddSheet } from "@/components/sheet/productSheet";

interface CategoryProps {
  category: {
    id: string;
    name: string;
    items: { id: string; name: string; price: string; image: string }[];
  };
}

const CategoryItem = ({ category }: CategoryProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: category.id,
    });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={{
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
          transition,
        }}
        className="p-3 border bg-gray-100 rounded-lg mb-2 shadow-md"
      >
        <div className="flex justify-between items-center">
          {/* Left side */}
          <div className="flex items-center space-x-2">
            <span
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-500"
            >
              <Grip size={16} />
            </span>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Category Name</span>
              <span className="font-semibold">{category.name}</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
              {category.items.length}
            </span>
            {/* <Button variant="outline">+ Product</Button> */}
            <ProductAddSheet />
            <EllipsisVertical />
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ChevronDown /> : <ChevronRight />}
            </button>
          </div>
        </div>
        {isOpen && <SubItemList items={category.items} />}
      </motion.div>
    </>
  );
};

export default CategoryItem;
