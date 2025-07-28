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

interface SubItemProps {
  item: ProductTypes;
}

const SubItem = ({ item }: SubItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });

  const [IsVisible, SetIsVisible] = useState(false);
  const [IsExpanded, SetIsExpanded] = useState(false);

  const handleVisiblity = () => {
    SetIsVisible(!IsVisible);
  };

  const handleExpand = () => {
    SetIsExpanded(!IsExpanded);
  };
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

      <div className="text-xs space-x-2 flex">
        <span className="text-gray-500">{item.price}</span>
        {IsVisible ? (
          <span className="text-blue-500 cursor-pointer">
            <Eye size={18} onClick={handleVisiblity} />
          </span>
        ) : (
          <span className="text-gray-400 cursor-pointer">
            <EyeOffIcon size={18} onClick={handleVisiblity} />
          </span>
        )}
      </div>

      <div className=" relative mx-2">
        <EllipsisVertical
          onClick={handleExpand}
          size={16}
          className={`${
            IsExpanded ? "bg-gray-100 rounded-full " : ""
          } hover:cursor-pointer w-6 `}
        />

        {IsExpanded && (
          <div className="flex space-x-1 text-xs absolute right-0 mt-1  rounded-lg z-10  bg-white py-4 px-2 shadow-md">
            <ul className="space-y-2  ">
              <li className="flex space-x-1  hover:bg-gray-100 p-1 rounded-sm cursor-pointer">
                <Layers2 size={14} />
                <span>Duplicate</span>
              </li>

              <li className="flex space-x-1 hover:bg-gray-100 p-1 rounded-sm cursor-pointer">
                <Trash2 size={14} className="text-red-500 " />
                <span>Delete</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SubItem;
