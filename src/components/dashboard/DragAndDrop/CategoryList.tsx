"use client";

import { useDragAndDrop } from "./DragAndDropContext";
import CategoryItem from "./CategoryItem";

const CategoryList = () => {
  const { categories } = useDragAndDrop();

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Menu Categories</h2>
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
};

export default CategoryList;
