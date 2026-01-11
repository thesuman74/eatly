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
import UploadPage from "@/app/dashboard/[restaurantId]/(menu)/upload/_components/UploadForm";
import CategoryItem from "./CategoryItem";

import { useAddCategory } from "@/hooks/category/useAddCategory";
import { CategoryUpdate, getCategoriesAPI } from "@/services/categoryServices";
import { useProductSheet } from "@/stores/ui/productSheetStore";
import { ProductAddSheet } from "@/components/sheet/productAddSheet";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import HorizontalCategoryList from "../HorizontalCategoryList";
import { useUpdateCategories } from "@/hooks/category/useUpdateCategory";
import { ActionGuard } from "@/lib/rbac/actionGurad";
import { Permission } from "@/lib/rbac/permission";

interface CategoryListProps {
  initialCategories: ProductCategoryTypes[];
}

const CategoryList = ({ initialCategories }: CategoryListProps) => {
  const [scanMenu, setScanMenu] = useState(false);
  const [categories, setCategories] = useState<ProductCategoryTypes[]>(
    initialCategories || []
  );

  useEffect(() => {
    if (initialCategories) {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  // React Query mutations
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategories();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);

      const newCategories = arrayMove(categories, oldIndex, newIndex);
      setCategories(newCategories);

      // Map to positions for API
      const updatedPositions: CategoryUpdate[] = newCategories.map(
        (cat, index) => ({ id: cat.id, position: index + 1 })
      );

      updateCategory.mutate(updatedPositions);
    }
  };

  return (
    <>
      <div className=" w-auto mx-auto mt-2 p-4 bg-background shadow-md rounded-md">
        {/* Buttons */}
        <div className="flex space-x-2 mb-4">
          <ActionGuard action={Permission.CREATE_CATEGORY}>
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
          </ActionGuard>
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
        <HorizontalCategoryList categories={categories ?? []} />

        {/* Drag & Drop context */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories?.map((category) => category.id)}
            strategy={verticalListSortingStrategy}
          >
            {categories && categories?.length > 0 ? (
              categories?.map((category, index) => (
                <CategoryItem key={category.id + index} category={category} />
              ))
            ) : (
              <>
                <div className="flex flex-col items-center justify-center h-60  ">
                  <h1 className="text-2xl font-bold mb-4">
                    No Categories found
                  </h1>
                </div>
              </>
            )}

            {}
          </SortableContext>
        </DndContext>

        {/* Scan Menu Modal */}
        {scanMenu && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-background w-full max-w-5xl rounded-md shadow-lg p-6 relative">
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
