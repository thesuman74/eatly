"use client";

import { createContext, useContext, useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ProductCategoryTypes } from "@/lib/types/menu-types";
import { updateCategoryPositions } from "@/app/dashboard/(menu)/products/actions/category/UpdateCategories";

// Define types
interface SubItem {
  id: string;
  name: string;
  price: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
  products: SubItem[];
}

interface DragAndDropContextType {
  categories: ProductCategoryTypes[];
  setCategories: React.Dispatch<React.SetStateAction<ProductCategoryTypes[]>>;
}

const DragContext = createContext<DragAndDropContextType | null>(null);

export const DragAndDropProvider = ({
  children,
  initialCategories,
}: {
  children: React.ReactNode;
  initialCategories: ProductCategoryTypes[];
}) => {
  const [categories, setCategories] =
    useState<ProductCategoryTypes[]>(initialCategories);

  console.log("initialCategories", initialCategories);

  // const handleDragEnd = async (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   if (!over || active.id === over.id) return;

  //   // Check if the item being moved is a category
  //   const isCategory = categories.some((category) => category.id === active.id);
  //   if (!isCategory) return;

  //   const oldIndex = categories.findIndex(
  //     (category) => category.id === active.id
  //   );
  //   console.log("oldIndex", oldIndex);
  //   const newIndex = categories.findIndex(
  //     (category) => category.id === over.id
  //   );

  //   console.log("newIndex", newIndex);

  //   if (oldIndex === -1 || newIndex === -1) return;

  //   // Reorder locally
  //   const reordered = arrayMove(categories, oldIndex, newIndex);
  //   setCategories(reordered);

  //   // Sync updated positions to backend
  //   for (let i = 0; i < reordered.length; i++) {
  //     await updateCategoryPositions(reordered[i].id, i.toString());
  //   }
  // };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    console.log("categories after initial", categories);

    // 🔍 Use current state, not inside setCategories
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);

    console.log("oldIndex", oldIndex);
    console.log("newIndex", newIndex);
    console.log("Active ID:", active.id);
    console.log("Over ID:", over.id);
    console.log(
      "Categories:",
      categories.map((c) => c.id)
    );

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(categories, oldIndex, newIndex);
      setCategories(newOrder); // 💾 update state
    }
  };

  return (
    <DragContext.Provider value={{ categories, setCategories }}>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {children}
      </DndContext>
    </DragContext.Provider>
  );
};

// Custom hook for using the context
export const useDragAndDrop = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error("useDragAndDrop must be used within a DragAndDropProvider");
  }
  return context;
};
