"use client";
import CategoryList from "@/components/dashboard/DragAndDrop/CategoryList";
import { DragAndDropProvider } from "@/components/dashboard/DragAndDrop/DragAndDropContext";
import TopSection from "@/components/menu/TopSection";
import { getCategoriesAPI } from "@/services/categoryServices";
import {
  getUserRestaurants,
  getUserRestaurantsAPI,
} from "@/services/resturantServices";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";

export default function Page() {
  const restaurandId = useRestaurantStore((state) => state.restaurantId);

  // const restaurandId = "56cce575-a8e0-4b9e-85c6-da6c699284bc";
  // console.log("restaurandId FROM [PAGE-ZUSTAND ", restaurandId);

  const { data: categoriesData = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesAPI(restaurandId),
    enabled: !!restaurandId,
  });

  // console.log("categoriesData", categoriesData);

  // const { data: restaurantData } = useQuery({
  //   queryKey: ["restaurants"],
  //   queryFn: () => getUserRestaurantsAPI(restaurandId),
  // });

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50">
      {/* <TopSection restaurant={restaurantData?[0]} /> */}

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <DragAndDropProvider initialCategories={categoriesData || []}>
            <CategoryList initialCategories={categoriesData} />
          </DragAndDropProvider>
        </Suspense>
      </div>
    </div>
  );
}
