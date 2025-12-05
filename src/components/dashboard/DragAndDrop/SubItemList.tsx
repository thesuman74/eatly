"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SubItem from "./SubItem";
import { ProductTypes } from "@/lib/types/menu-types";
import { useState } from "react";

interface SubItemListProps {
  initialProducts: ProductTypes[];
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

const SubItemList = ({
  initialProducts,
  onDelete,
  onDuplicate,
  onToggleVisibility,
}: SubItemListProps) => {
  return (
    <SortableContext
      items={initialProducts}
      strategy={verticalListSortingStrategy}
    >
      <div className="ml-6 mt-2">
        {initialProducts?.map((item) => (
          <SubItem
            key={item.id}
            item={item}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onToggleVisibility={onToggleVisibility}
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default SubItemList;
