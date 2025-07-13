"use client";

import { useDragAndDrop } from "./DragAndDropContext";
import CategoryItem from "./CategoryItem";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const CategoryList = () => {
  const { categories } = useDragAndDrop();

  return (
    <div className="max-w-full mx-auto mt-2 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Menu Categories</h2>
      <SortableContext
        items={categories}
        strategy={verticalListSortingStrategy}
      >
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </SortableContext>
    </div>
  );
};

export default CategoryList;
