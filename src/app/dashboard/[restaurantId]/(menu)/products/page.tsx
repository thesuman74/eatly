"use client";
import CategoryList from "@/components/dashboard/DragAndDrop/CategoryList";
import { DragAndDropProvider } from "@/components/dashboard/DragAndDrop/DragAndDropContext";
import TopSection from "@/components/menu/TopSection";
import { Restaurant } from "@/lib/types/resturant-types";
import { getCategoriesAPI } from "@/services/categoryServices";
import { getUserRestaurantsAPI } from "@/services/resturantServices";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";

export default function Page() {
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories", restaurantId],
    queryFn: () => getCategoriesAPI(restaurantId),
    enabled: !!restaurantId,
  });

  const {
    data: restaurantData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurants", restaurantId],
    queryFn: () => getUserRestaurantsAPI(restaurantId),
    enabled: !!restaurantId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !restaurantData || restaurantData.length === 0) {
    return <div>No restaurant found</div>;
  }

  const activeRestaurant = restaurantData?.find(
    (r: Restaurant) => r.id === restaurantId
  );

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50">
      <TopSection restaurant={activeRestaurant} />

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
