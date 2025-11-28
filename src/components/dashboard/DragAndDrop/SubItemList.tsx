"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SubItem from "./SubItem";
import { ProductTypes } from "@/lib/types/menu-types";

interface SubItemListProps {
  products: ProductTypes[];
}

const SubItemList = ({ products }: SubItemListProps) => {
  return (
    <SortableContext items={products} strategy={verticalListSortingStrategy}>
      <div className="ml-6 mt-2">
        {products?.map((item) => (
          <SubItem key={item.id} item={item} />
        ))}
      </div>
    </SortableContext>
  );
};

export default SubItemList;
