"use client";

import { createContext, useContext, useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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
  items: SubItem[];
}

interface DragAndDropContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const DragContext = createContext<DragAndDropContextType | null>(null);

export const DragAndDropProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Tea Specials",
      items: [
        {
          id: "1-1",
          name: "Green Tea",
          price: "Rs 4.00",
          image: "/Images/coffee.png",
        },
        {
          id: "1-2",
          name: "Masala Tea",
          price: "Rs 5.00",
          image: "/Images/coffee.png",
        },
        {
          id: "1-3",
          name: "Lemon Tea",
          price: "Rs 5.00",
          image: "/Images/coffee.png",
        },
      ],
    },
    {
      id: "2",
      name: "Desserts",
      items: [
        {
          id: "2-1",
          name: "Chocolate Cake",
          price: "Rs 8.00",
          image: "/Images/coffee.png",
        },
      ],
    },
  ]);

  // Handle Drag End for both categories and sub-items
  //   const handleDragEnd = (event: DragEndEvent) => {
  //     const { active, over } = event;
  //     if (!over || active.id === over.id) return;

  //     setCategories((prev) => {
  //       // 🔹 Dragging a category
  //       const activeCategoryIndex = prev.findIndex((cat) => cat.id === active.id);
  //       const overCategoryIndex = prev.findIndex((cat) => cat.id === over.id);
  //       if (activeCategoryIndex !== -1 && overCategoryIndex !== -1) {
  //         return arrayMove(prev, activeCategoryIndex, overCategoryIndex);
  //       }

  //       // 🔹 Dragging a sub-item
  //       let updatedCategories = [...prev];
  //       let activeCategory: Category | undefined;
  //       let overCategory: Category | undefined;

  //       for (let cat of updatedCategories) {
  //         const foundActiveItem = cat.items.find((item) => item.id === active.id);
  //         const foundOverItem = cat.items.find((item) => item.id === over.id);
  //         if (foundActiveItem) activeCategory = cat;
  //         if (foundOverItem) overCategory = cat;
  //       }

  //       // If both items belong to the same category
  //       if (
  //         activeCategory &&
  //         overCategory &&
  //         activeCategory.id === overCategory.id
  //       ) {
  //         const oldIndex = activeCategory.items.findIndex(
  //           (item) => item.id === active.id
  //         );
  //         const newIndex = overCategory.items.findIndex(
  //           (item) => item.id === over.id
  //         );
  //         activeCategory.items = arrayMove(
  //           activeCategory.items,
  //           oldIndex,
  //           newIndex
  //         );
  //       }

  //       return updatedCategories;
  //     });
  //   };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    setCategories((prevCategories) => {
      // 🔹 1. Check if it's a category move
      const oldIndex = prevCategories.findIndex((c) => c.id === active.id);
      const newIndex = prevCategories.findIndex((c) => c.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(prevCategories, oldIndex, newIndex);
      }

      // 🔹 2. Otherwise, it's a sub-item move within the same category
      return prevCategories.map((category) => {
        const oldProductIndex = category.items.findIndex(
          (p) => p.id === active.id
        );
        const newProductIndex = category.items.findIndex(
          (p) => p.id === over.id
        );

        if (oldProductIndex !== -1 && newProductIndex !== -1) {
          return {
            ...category,
            items: arrayMove(category.items, oldProductIndex, newProductIndex),
          };
        }

        return category;
      });
    });
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
