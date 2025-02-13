"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SubItem from "./SubItem";

interface SubItemListProps {
  items: { id: string; name: string; price: string; image: string }[];
}

const SubItemList = ({ items }: SubItemListProps) => {
  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div className="ml-6 mt-2">
        {items.map((item) => (
          <SubItem key={item.id} item={item} />
        ))}
      </div>
    </SortableContext>
  );
};

export default SubItemList;
