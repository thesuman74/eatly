"use client";

import { useEffect, useState } from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { ProductCategoryTypes } from "@/lib/types/menu-types";
import UploadPage from "@/app/dashboard/(menu)/upload/_components/UploadForm";
import CategoryItem from "./CategoryItem";

import { useAddCategory } from "@/hooks/category/useAddCategory";
import { useUpdateCategoryPositions } from "@/hooks/category/useUpdateCategoryPositions";
import {
  CategoryPositionUpdate,
  getCategoriesAPI,
} from "@/services/categoryServices";
import { useProductSheet } from "@/stores/ui/productSheetStore";
import { ProductAddSheet } from "@/components/sheet/productAddSheet";

interface CategoryListProps {
  initialCategories: ProductCategoryTypes[];
}

const CategoryList = ({ initialCategories }: CategoryListProps) => {
  const [scanMenu, setScanMenu] = useState(false);
  const [categories, setCategories] = useState<ProductCategoryTypes[]>([]);

  const queryClient = useQueryClient();

  // Fetch categories from API (or use SSR initial categories)
  const { data: fetchedCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAPI,
    initialData: initialCategories,
  });

  // React Query mutations
  const addCategory = useAddCategory();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const updatePositions = useUpdateCategoryPositions(baseUrl);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (fetchedCategories) setCategories(fetchedCategories);
  }, [fetchedCategories]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);

      const newCategories = arrayMove(categories, oldIndex, newIndex);
      setCategories(newCategories);

      // Map to positions for API
      const updatedPositions: CategoryPositionUpdate[] = newCategories.map(
        (cat, index) => ({ id: cat.id, position: index + 1 })
      );

      updatePositions.mutate(updatedPositions, {
        onSuccess() {
          queryClient.setQueryData(["categories"], newCategories);
        },
      });
    }
  };

  return (
    <>
      <div className=" w-auto mx-auto mt-2 p-4 bg-white shadow-md rounded-md">
        {/* Buttons */}
        <div className="flex space-x-2 mb-4">
          <Button
            variant="outline"
            onClick={() => addCategory.mutate()}
            className="text-lg font-bold flex items-center"
          >
            {addCategory.isPending ? (
              <LoaderCircle className="animate-spin" size={20} />
            ) : (
              <Plus size={20} />
            )}
            <span className="ml-2">Add New Category</span>
          </Button>

          <Button
            variant="outline"
            className="text-lg font-bold flex items-center"
            onClick={() => setScanMenu(true)}
          >
            <SquareMenu />
            <span className="ml-2">Scan Menu</span>
          </Button>
        </div>

        {/* Category list preview */}
        <div className="overflow-x-hidden scrollbar-hide mb-4">
          <div className="flex space-x-4 px-2">
            {categories?.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-1 whitespace-nowrap rounded-md bg-gray-100 px-3 py-1 hover:bg-gray-200 transition"
              >
                <span className="text-gray-700 font-medium">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
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
    </>
  );
};

export default CategoryList;
