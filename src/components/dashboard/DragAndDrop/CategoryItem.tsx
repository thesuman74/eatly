"use client";

import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { useState } from "react";
import SubItemList from "./SubItemList";
import {
  Grip,
  ChevronDown,
  ChevronRight,
  EllipsisVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductAddSheet } from "@/components/sheet/productAddSheet";
import ProductOrdersheet from "@/components/sheet/ProductOrdersheet";
import { Badge } from "@/components/ui/badge";
import { ProductCategoryTypes } from "@/lib/types/menu-types";
import { updateCategoryName } from "@/app/dashboard/(menu)/products/actions/category/UpdateCategories";
import { toast } from "react-toastify";
import CategoryOptions from "./CategoryOptions";

interface CategoryProps {
  category: ProductCategoryTypes;
  setCategories: React.Dispatch<React.SetStateAction<ProductCategoryTypes[]>>;
}

const CategoryItem = ({ category, setCategories }: CategoryProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: category.id,
    });
  const [isOpen, setIsOpen] = useState(false);
  const [isEllipse, setIsEllipse] = useState(false);
  const [editcategory, setCategory] = useState(category);

  const [isSaving, setIsSaving] = useState(false);

  const handleDeleteCategory = async (categoryId: string) => {
    console.log("categoryId from handle", categoryId);
    try {
      const res = await fetch(
        `/api/menu/categories/delete?categoryId=${categoryId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        // Update UI
        setCategories((prev) => prev.filter((c: any) => c.id !== categoryId));
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Network or server error");
      console.error(error);
    }
  };
  const handleBlur = async () => {
    if (editcategory.name !== category.name) {
      setIsSaving(true);
      const success = await updateCategoryName(category.id, editcategory.name);
      setIsSaving(false);
      if (success === true) {
        toast.success("Category updated Sucessfully");
        return;
      }
      toast.error("Failed to update");
    }
  };

  // DUPLICATE CATEGORY
  const handleDuplicateCategory = () => {
    const newCategory = {
      ...category,
      id: crypto.randomUUID(),
      name: category.name + " Copy",
    };
    setCategories((prev) => [...prev, newCategory]);
    toast.success("Category duplicated!");
  };

  // TOGGLE VISIBILITY
  const handleToggleVisibility = () => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === category.id ? { ...c, visible: !c.isVisible } : c
      )
    );
    toast.success("Visibility toggled!");
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={{
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
          transition,
        }}
        className="p-3 border bg-gray-100 rounded-lg mb-2 shadow-md"
      >
        <div className="flex justify-between items-center">
          {/* Left side */}
          <div className="flex items-center space-x-2">
            <span
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-500"
            >
              <Grip size={16} />
            </span>
            <div className="flex flex-col ">
              <span className="text-sm text-gray-500">Category Name</span>
              <span className="300"></span>

              <input
                type="text"
                className="font-semibold w-[200px] outline-none  border-b border-gray-400 focus:border-b-2 focus:border-black bg-transparent"
                value={editcategory.name}
                onChange={(e) =>
                  setCategory({ ...editcategory, name: e.target.value })
                }
                onBlur={handleBlur}
              />
              {isSaving && <span>Saving...</span>}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-600 px-2 py-1 rounded-full text-xs text-white">
              {category?.products?.length}
            </Badge>
            {/* <Button variant="outline">+ Product</Button> */}
            <ProductAddSheet />
            <CategoryOptions
              onToggleVisibility={() => handleToggleVisibility()}
              onDuplicate={() => handleDuplicateCategory()}
              onDelete={() => handleDeleteCategory(category.id)}
            />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-200 rounded-full p-2"
            >
              {isOpen ? <ChevronDown /> : <ChevronRight />}
            </button>
          </div>
        </div>
        {isOpen && <SubItemList products={category.products} />}
      </motion.div>
    </>
  );
};

export default CategoryItem;
