"use client";

import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { useState } from "react";
import SubItemList from "./SubItemList";
import { Grip, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductAddSheet } from "@/components/sheet/productAddSheet";
import CategoryOptions from "./CategoryOptions";
import { ProductCategoryTypes } from "@/lib/types/menu-types";
import { useUpdateCategoryName } from "@/hooks/category/useUpdateCategoryName";
import { useDuplicateCategory } from "@/hooks/category/useDuplicateCategory";
import { useToggleCategoryVisibility } from "@/hooks/category/useToggleCategoryVisibility";
import { useDeleteCategory } from "@/hooks/category/useDeleteCategory";
import { useProductSheet } from "@/app/stores/useProductSheet";
import { Button } from "@/components/ui/button";

interface CategoryProps {
  category: ProductCategoryTypes;
}

const CategoryItem = ({ category }: CategoryProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: category.id });
  const [isOpen, setIsOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(category);
  const { openAddSheet, closeSheet } = useProductSheet();

  // React Query hooks
  const updateCategoryName = useUpdateCategoryName();
  const duplicateCategory = useDuplicateCategory();
  const toggleVisibility = useToggleCategoryVisibility();
  const deleteCategory = useDeleteCategory();

  const handleBlur = async () => {
    if (editCategory.name !== category.name) {
      try {
        await updateCategoryName.mutateAsync({
          categoryId: category.id,
          name: editCategory.name,
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // edit -> productId filter -> ProductAddSheet -> if initial data update else add

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
      className={`p-3 border rounded-lg mb-2 shadow-md ${
        category.isVisible
          ? "bg-gray-100/10"
          : "bg-gray-100 opacity-80 shadow-none"
      }`}
    >
      {" "}
      <ProductAddSheet />
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-500"
          >
            <Grip size={16} />
          </span>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Category Name</span>
            <div className="flex space-x-2">
              <input
                type="text"
                className="font-semibold w-[200px] outline-none border-b border-gray-400 focus:border-b-2 focus:border-black bg-transparent"
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, name: e.target.value })
                }
                onBlur={handleBlur}
              />
              {updateCategoryName.isPending ? (
                <span className="text-xs text-gray-500">saving....</span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={"outline"}
            onClick={() => openAddSheet(category.id)}
            className="mx-8"
          >
            + Product
          </Button>
          <Badge className="bg-blue-600 px-2 py-1 rounded-full text-xs text-white">
            {category.products?.length || 1}
          </Badge>

          {!category.isVisible && (
            <Badge className="bg-red-600 px-2 py-1 rounded-full text-xs text-white">
              Hidden
            </Badge>
          )}

          <CategoryOptions
            onToggleVisibility={() => toggleVisibility.mutateAsync(category.id)}
            onDuplicate={() => duplicateCategory.mutateAsync(category.id)}
            onDelete={() => deleteCategory.mutateAsync(category.id)}
          />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-200 rounded-full p-2"
          >
            {isOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
        </div>
      </div>
      {isOpen && (
        <SubItemList products={category.products} categoryID={category.id} />
      )}
    </motion.div>
  );
};

export default CategoryItem;
