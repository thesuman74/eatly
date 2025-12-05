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
import { useAdminCategoryStore } from "@/app/stores/useAdminCategoryStore";

interface CategoryProps {
  category: ProductCategoryTypes;
}

const CategoryItem = ({ category }: CategoryProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: category.id,
    });
  const [isOpen, setIsOpen] = useState(false);
  const [editcategory, setCategory] = useState(category);
  const [isSaving, setIsSaving] = useState(false);

  const [products, setProducts] = useState(category?.products);

  const deleteCategoryAsync = useAdminCategoryStore(
    (state) => state.deleteCategoryAsync
  );

  const handleCategoryDelete = async (categoryId: string) => {
    await deleteCategoryAsync(categoryId);
  };

  // const handleDeleteCategory = async (categoryId: string) => {
  //   console.log("categoryId from handle", categoryId);
  //   try {
  //     const res = await fetch(
  //       `/api/menu/categories/delete?categoryId=${categoryId}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );
  //     const data = await res.json();
  //     if (res.ok) {
  //       // Update UI
  //       setCategories((prev) => prev.filter((c: any) => c.id !== categoryId));
  //       toast.success(data.message);
  //     } else {
  //       toast.error(data.error);
  //     }
  //   } catch (error) {
  //     toast.error("Network or server error");
  //     console.error(error);
  //   }
  // };
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
  const handleDuplicateCategory = async () => {
    try {
      const res = await fetch("/api/menu/categories/duplicate", {
        method: "POST",
        body: JSON.stringify({ categoryId: category.id }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.category) {
        // setCategories((prev) => [...prev, data.category]);
        toast.success(data.message || "Category duplicated!");
      } else {
        toast.error(data.error || "Failed to duplicate category");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network or server error");
    }
  };

  // TOGGLE VISIBILITY
  const handleToggleVisibility = async () => {
    try {
      const res = await fetch("/api/menu/categories/toggle-visibility", {
        method: "PATCH",
        body: JSON.stringify({ categoryId: category.id }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.category) {
        // setCategories((prev) =>
        //   prev.map((c) => (c.id === category.id ? data.category : c))
        // );
        toast.success(data.message || "Visibility toggled!");
      } else {
        toast.error(data.error || "Failed to toggle visibility");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network or server error");
    }
  };

  const handleProductDelete = async (productId: string) => {
    try {
      const res = await fetch(
        `/api/menu/products/delete?productId=${productId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      console.log("delete data", data);
      if (res.ok) {
        // Update UI
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
      setProducts((prev) => prev.filter((p: any) => p.id !== productId));
    } catch (error) {
      toast.error("Network or server error");
      console.error(error);
    }
  };

  const handleProductDuplicate = () => {};
  const handleProductVisibility = () => {};

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
        className={`p-3 border rounded-lg mb-2 shadow-md ${
          category.isVisible
            ? "bg-gray-100/10  "
            : "bg-gray-100 opacity-80 shadow-none "
        }`}
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
              {category?.products?.length || 1}
            </Badge>
            {/* <Button variant="outline">+ Product</Button> */}
            <ProductAddSheet categoryId={category.id} />
            <CategoryOptions
              onToggleVisibility={() => handleToggleVisibility()}
              onDuplicate={() => handleDuplicateCategory()}
              onDelete={() => handleCategoryDelete(category.id)}
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
          <SubItemList
            initialProducts={products || []}
            onDelete={handleProductDelete}
            onDuplicate={handleProductDuplicate}
            onToggleVisibility={handleProductVisibility}
          />
        )}
      </motion.div>
    </>
  );
};

export default CategoryItem;
