import CategoryList from "@/components/dashboard/DragAndDrop/CategoryList";
import { DragAndDropProvider } from "@/components/dashboard/DragAndDrop/DragAndDropContext";
import TopSection from "@/components/menu/TopSection";
import { getUserRestaurants } from "@/services/resturantServices";
import { getCategoriesFromDB } from "@/services/server/ServerCategoryServices";
import { Suspense } from "react";

export default async function Page() {
  const categoriesData = await getCategoriesFromDB();
  const restaurantData = await getUserRestaurants();
  console.log("restaurantData", restaurantData);

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50">
      <TopSection restaurant={restaurantData[0]} />

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <DragAndDropProvider initialCategories={categoriesData}>
            <CategoryList initialCategories={categoriesData} />
          </DragAndDropProvider>
        </Suspense>
      </div>
    </div>
  );
}
