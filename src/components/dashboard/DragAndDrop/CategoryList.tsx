"use client";

import { useDragAndDrop } from "./DragAndDropContext";
import CategoryItem from "./CategoryItem";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { SquareMenu } from "lucide-react";
import { useEffect, useState } from "react";
import UploadPage from "@/app/(dashboard)/(menu)/upload/_components/UploadForm";
import { ProductCategoryTypes } from "@/lib/types/menu-types";

interface CategoryListProps {
  categoriesData: ProductCategoryTypes[];
}
const CategoryList = ({ categoriesData }: CategoryListProps) => {
  const { categories } = useDragAndDrop();
  const [scanMenu, setScanMenu] = useState(false);
  const [loading, isLoading] = useState(false);

  console.log("categoriesfrom category list", categories);

  const handleAddCategory = async () => {
    try {
      isLoading(true);
      const response = await fetch("/api/menu/structured", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Error: " + data.error);
        return;
      }
      isLoading(false);

      alert("Created category: " + data.category.name);
      // You can update your UI here with the returned data
    } catch (error) {
      alert("Network error");
      console.error(error);
    }
  };

  return (
    <div className="max-w-full  mx-auto mt-2 p-4 bg-white shadow-md rounded-md">
      <div className="flex space-x-2">
        <Button className="text-xl font-bold mb-4">Menu Categories</Button>

        <Button
          variant={"outline"}
          onClick={() => handleAddCategory()}
          className="text-lg font-bold mb-4"
        >
          Add New Category
        </Button>
        <Button
          variant={"outline"}
          className="text-lg font-bold mb-4"
          onClick={() => setScanMenu(true)}
        >
          Scan Menu
          <span>
            <SquareMenu />
          </span>
        </Button>
      </div>

      <div>
        <div className="flex space-x-2 ">
          {categoriesData?.map((category) => (
            <ul key={category.id}>
              <li>
                {category.name} {">"}
              </li>
            </ul>
          ))}
        </div>
      </div>

      <SortableContext
        items={categories.map((category) => category.id)} // No need to sort
        strategy={verticalListSortingStrategy}
      >
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </SortableContext>

      {scanMenu && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-full max-w-5xl rounded-md shadow-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={() => setScanMenu(false)}
            >
              ✕
            </button>
            <UploadPage />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
