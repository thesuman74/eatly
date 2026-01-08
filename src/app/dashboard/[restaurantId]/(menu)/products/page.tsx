"use client";
import CategoryList from "@/components/dashboard/DragAndDrop/CategoryList";
import { DragAndDropProvider } from "@/components/dashboard/DragAndDrop/DragAndDropContext";
import TopSection from "@/components/menu/TopSection";
import { Restaurant } from "@/lib/types/resturant-types";
import { getCategoriesAPI } from "@/services/categoryServices";
import { getUserRestaurantsAPI } from "@/services/restaurantServices";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  CategoriesSkeleton,
  MenuPageSkeleton,
} from "./_components/MenuPageSkeleton";

export default function Page() {
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories", restaurantId],
    queryFn: () => getCategoriesAPI(restaurantId),
    enabled: !!restaurantId,
  });

  const {
    data: restaurantData,
    isLoading: isRestaurantLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurants", restaurantId],
    queryFn: () => getUserRestaurantsAPI(restaurantId),
    enabled: !!restaurantId,
  });

  // if (isError || !restaurantData || restaurantData.length === 0) {
  //   return <div>No restaurant found</div>;
  // }

  const activeRestaurant = Array.isArray(restaurantData)
    ? restaurantData.find((r: Restaurant) => r.id === restaurantId) ||
      restaurantData[0]
    : restaurantData; // fallback for staff

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50">
      {isRestaurantLoading ? (
        <MenuPageSkeleton />
      ) : (
        <TopSection restaurant={activeRestaurant} />
      )}

      {isCategoriesLoading ? (
        <CategoriesSkeleton />
      ) : (
        <DragAndDropProvider initialCategories={categoriesData || []}>
          <CategoryList initialCategories={categoriesData} />
        </DragAndDropProvider>
      )}
    </div>
  );
}
