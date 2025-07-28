"use client";

import { createContext, useContext, useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ProductCategoryTypes } from "@/lib/types/menu-types";

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
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<ProductCategoryTypes[]>([
    {
      id: "1",
      name: "Tea Specials",
      slug: "tea-specials",
      position: 0,
      products: [
        {
          id: "1-1",
          name: "Green Tea",
          slug: "green-tea",
          description: "Green Tea description",
          price: 400, // Rs 4.00 → 400 cents
          currency: "NPR",
          image: {
            url: "/Images/coffee.png",
            alt: "Green Tea",
          },
          available: true,
        },
        {
          id: "1-2",
          name: "Masala Tea",
          slug: "masala-tea",
          description: "Masala Tea description",
          price: 500,
          currency: "NPR",
          image: {
            url: "/Images/coffee.png",
            alt: "Masala Tea",
          },
          available: true,
        },
        {
          id: "1-3",
          name: "Lemon Tea",
          slug: "lemon-tea",
          description: "Lemon Tea description",
          price: 500,
          currency: "NPR",
          image: {
            url: "/Images/coffee.png",
            alt: "Lemon Tea",
          },
          available: true,
        },
      ],
    },
    {
      id: "2",
      name: "Desserts",
      slug: "desserts",
      position: 1,
      products: [
        {
          id: "2-1",
          name: "Chocolate Cake",
          slug: "chocolate-cake",
          description: "Chocolate Cake description",
          price: 800,
          currency: "NPR",
          image: {
            url: "/Images/coffee.png",
            alt: "Chocolate Cake",
          },
          available: true,
        },
      ],
    },
  ]);

  // Handle Drag End for both categories and sub-products
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
  //         const foundActiveItem = cat.products.find((item) => item.id === active.id);
  //         const foundOverItem = cat.products.find((item) => item.id === over.id);
  //         if (foundActiveItem) activeCategory = cat;
  //         if (foundOverItem) overCategory = cat;
  //       }

  //       // If both products belong to the same category
  //       if (
  //         activeCategory &&
  //         overCategory &&
  //         activeCategory.id === overCategory.id
  //       ) {
  //         const oldIndex = activeCategory.products.findIndex(
  //           (item) => item.id === active.id
  //         );
  //         const newIndex = overCategory.products.findIndex(
  //           (item) => item.id === over.id
  //         );
  //         activeCategory.products = arrayMove(
  //           activeCategory.products,
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
        const oldProductIndex = category.products.findIndex(
          (p) => p.id === active.id
        );
        const newProductIndex = category.products.findIndex(
          (p) => p.id === over.id
        );

        if (oldProductIndex !== -1 && newProductIndex !== -1) {
          return {
            ...category,
            products: arrayMove(
              category.products,
              oldProductIndex,
              newProductIndex
            ),
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
