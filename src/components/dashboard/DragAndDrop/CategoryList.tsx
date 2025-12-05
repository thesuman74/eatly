"use client";

import { useDragAndDrop } from "./DragAndDropContext";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Plus, SquareMenu } from "lucide-react";
import { use, useEffect, useState } from "react";
import UploadPage from "@/app/dashboard/(menu)/upload/_components/UploadForm";
import { ProductCategoryTypes } from "@/lib/types/menu-types";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { useAdminCategoryStore } from "@/app/stores/useAdminCategoryStore";

interface CategoryListProps {
  initialCategories: ProductCategoryTypes[];
}
const CategoryItem = dynamic(() => import("./CategoryItem"), {
  ssr: false,
});

const CategoryList = ({ initialCategories }: CategoryListProps) => {
  console.log("initialCategories", initialCategories);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  // const { categories, setCategories } = useDragAndDrop();
  const [scanMenu, setScanMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [Positionupdating, isPositionUpdating] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const categories = useAdminCategoryStore((state) => state.categories);
  const setCategories = useAdminCategoryStore((state) => state.setCategories);
  const addCategory = useAdminCategoryStore((state) => state.addCategory);
  const updateCategory = useAdminCategoryStore((state) => state.updateCategory);

  console.log("categoriesData from category list", categories);
  const handleAddCategory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/menu/categories/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Error:" + data.error);
        return;
      }

      console.log("data", data);
      toast.success("Category created successfully!");

      addCategory(data.category);
    } catch (error) {
      alert("Network error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
  //       deleteCategory(categoryId);

  //       toast.success(data.message);
  //     } else {
  //       toast.error(data.error);
  //     }
  //   } catch (error) {
  //     toast.error("Network or server error");
  //     console.error(error);
  //   }
  // };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);

      const newCategories = arrayMove(categories, oldIndex, newIndex);

      // Update local state
      setCategories(newCategories);

      // Prepare positions for batch update
      const updatedPositions = newCategories.map((cat, index) => ({
        id: cat.id,
        position: index + 1, // 1-based
      }));

      console.log("updatedPositions", updatedPositions);

      // Call your new API or server function
      try {
        isPositionUpdating(true);
        const res = await fetch(
          `${baseUrl}/api/menu/categories/update/positions`,
          {
            method: "PATCH", // or PATCH depending on your API
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updates: updatedPositions }),
          }
        );
        const data = await res.json();
        console.log("position update data", data);

        if (data.success) {
          toast.success(data.message || "Positions updated successfully");
        } else {
          toast.error(data.message || "Failed to update positions");
        }
      } catch (err) {
        console.error("Failed to update positions:", err);
      }
    }
  };

  // DUPLICATE CATEGORY
  // const handleDuplicateCategory = async () => {
  //   try {
  //     const res = await fetch("/api/menu/categories/duplicate", {
  //       method: "POST",
  //       body: JSON.stringify({ categoryId: category.id }),
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     const data = await res.json();

  //     if (res.ok && data.category) {
  //       setCategories((prev) => [...prev, data.category]);
  //       toast.success(data.message || "Category duplicated!");
  //     } else {
  //       toast.error(data.error || "Failed to duplicate category");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Network or server error");
  //   }
  // };

  return (
    <div className="max-w-full  mx-auto mt-2 p-4 bg-white shadow-md rounded-md">
      <div className="flex space-x-2">
        {/* <Button className="text-xl font-bold mb-4">Menu Categories</Button> */}

        <Button
          variant={"outline"}
          onClick={() => handleAddCategory()}
          className="text-lg  font-bold mb-4"
        >
          {isLoading ? (
            <LoaderCircle className="text-xl animate-spin" size={20} />
          ) : (
            <Plus className="text-xl" size={20} />
          )}

          <span>Add New Category</span>
        </Button>
        <Button
          variant={"outline"}
          className="text-lg font-bold mb-4"
          onClick={() => setScanMenu(true)}
        >
          <span>
            <SquareMenu />
          </span>
          Scan Menu
        </Button>
      </div>

      <div>
        <div className="flex space-x-2 ">
          {categories &&
            categories?.map((category) => (
              <ul key={category.id}>
                <li>
                  {category.name} {">"}
                </li>
              </ul>
            ))}
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categories?.map((category) => category.id)} // No need to sort
          strategy={verticalListSortingStrategy}
        >
          {categories?.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </SortableContext>
      </DndContext>

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
