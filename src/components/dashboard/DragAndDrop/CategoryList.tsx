"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Plus, SquareMenu } from "lucide-react";
import { toast } from "react-toastify";
import { ProductCategoryTypes } from "@/lib/types/menu-types";
import UploadPage from "@/app/dashboard/(menu)/upload/_components/UploadForm";
import { useCategoryActions } from "@/hooks/useCategoryActions";
import CategoryItem from "./CategoryItem";

interface CategoryListProps {
  initialCategories: ProductCategoryTypes[];
}

const CategoryList = ({ initialCategories }: CategoryListProps) => {
  const [scanMenu, setScanMenu] = useState(false);

  // Get everything from the custom hook
  const {
    categories,
    setCategories,
    handleAddCategory,
    isLoading,
    handleUpdatePositions,
  } = useCategoryActions();

  // Initialize Zustand state from SSR props
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories, setCategories]);

  const sensors = useSensors(useSensor(PointerSensor));

  // Drag & Drop handler
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);

      const newCategories = arrayMove(categories, oldIndex, newIndex);
      handleUpdatePositions(newCategories);
    }
  };

  return (
    <div className="max-w-full mx-auto mt-2 p-4 bg-white shadow-md rounded-md">
      {/* Buttons */}
      <div className="flex space-x-2 mb-4">
        <Button
          variant="outline"
          onClick={handleAddCategory}
          className="text-lg font-bold"
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin" size={20} />
          ) : (
            <Plus size={20} />
          )}
          <span className="ml-2">Add New Category</span>
        </Button>

        <Button
          variant="outline"
          className="text-lg font-bold"
          onClick={() => setScanMenu(true)}
        >
          <SquareMenu />
          <span className="ml-2">Scan Menu</span>
        </Button>
      </div>

      {/* Category list preview */}
      <div className="flex space-x-2 mb-4">
        {categories.map((category) => (
          <ul key={category.id}>
            <li>{category.name} &gt;</li>
          </ul>
        ))}
      </div>

      {/* Drag & Drop context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categories.map((category) => category.id)}
          strategy={verticalListSortingStrategy}
        >
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </SortableContext>
      </DndContext>

      {/* Scan Menu Modal */}
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
