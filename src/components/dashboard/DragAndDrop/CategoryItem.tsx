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
import { useDuplicateCategory } from "@/hooks/category/useDuplicateCategory";
import { useDeleteCategory } from "@/hooks/category/useDeleteCategory";
import { useProductSheet } from "@/stores/ui/productSheetStore";
import { Button } from "@/components/ui/button";
import { useUpdateCategories } from "@/hooks/category/useUpdateCategory";
import { ActionGuard } from "@/lib/rbac/actionGurad";
import { Permission } from "@/lib/rbac/permission";

interface CategoryProps {
  category: ProductCategoryTypes;
}

const CategoryItem = ({ category }: CategoryProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: category.id });
  const [isOpen, setIsOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(category);
  const [isEditing, setIsEditing] = useState(false);
  const { openAddSheet } = useProductSheet();

  // React Query hooks
  const updateCategory = useUpdateCategories();
  const duplicateCategory = useDuplicateCategory();
  const deleteCategory = useDeleteCategory();

  const handleBlur = async () => {
    setIsEditing(true);
    if (editCategory.name !== category.name) {
      try {
        await updateCategory.mutateAsync([
          {
            id: category.id,
            name: editCategory.name,
          },
        ]);
      } catch (err) {
        console.error(err);
      }
      setIsEditing(false);
    }
  };

  const handleToggleVisibility = async (category: ProductCategoryTypes) => {
    await updateCategory.mutateAsync([
      {
        id: category.id,
        isVisible: !category.isVisible, // toggle the current value
      },
    ]);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
      className={`p-3 border rounded-lg mb-2 shadow-md
    ${category.isVisible ? "bg-gray-100/10" : "bg-gray-100 opacity-80 shadow-none"}
    flex flex-col gap-3
  `}
    >
      {/* ProductAddSheet */}
      <ProductAddSheet />

      {/* Category Row */}
      <div className="flex items-center gap-2 w-full">
        {/* LEFT — Category name (grows/shrinks) */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab hidden sm:block active:cursor-grabbing text-gray-500"
          >
            <Grip size={16} />
          </span>

          <div className="flex-1 min-w-0">
            <ActionGuard action={Permission.UPDATE_CATEGORY} mode="disable">
              <input
                type="text"
                className="font-semibold w-full outline-none border-b border-gray-400 focus:border-b-2 focus:border-black bg-transparent truncate"
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, name: e.target.value })
                }
                onBlur={handleBlur}
              />
            </ActionGuard>
            {isEditing && (
              <span className="text-xs text-gray-500">saving....</span>
            )}
          </div>
        </div>

        {/* RIGHT — Actions (never wrap) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* MOBILE / BELOW MD */}
          <div className="flex items-center gap-2 ">
            <ActionGuard action={Permission.CREATE_PRODUCT}>
              <Button
                variant="outline"
                onClick={() => openAddSheet(category.id)}
                className="md:block hidden"
              >
                + Product
              </Button>
            </ActionGuard>
            {!category.isVisible && (
              <Badge className="bg-red-600 px-2 py-1 rounded-full text-xs text-white">
                Hidden
              </Badge>
            )}

            <Badge className="bg-blue-600 px-2 py-1 rounded-full text-xs text-white">
              {category.products?.length || 1}
            </Badge>

            <ActionGuard action={Permission.UPDATE_CATEGORY}>
              <CategoryOptions
                onToggleVisibility={() => handleToggleVisibility(category)}
                onDuplicate={() => duplicateCategory.mutateAsync(category.id)}
                onDelete={() => deleteCategory.mutateAsync(category.id)}
                onProductAdd={() => openAddSheet(category.id)}
              />
            </ActionGuard>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-background rounded-full p-2"
          >
            {isOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
        </div>
      </div>

      {/* Sub Items */}
      {isOpen && (
        <SubItemList products={category.products} categoryID={category.id} />
      )}
    </motion.div>
  );
};

export default CategoryItem;
