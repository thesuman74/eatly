import React, { Suspense } from "react";
import MenuPage from "./_components/MenuPage";
import { getCategoriesFromDB } from "@/services/server/ServerCategoryServices";
import { getRestaurants } from "@/services/resturantServices";

export default async function Page() {
  const data = await getCategoriesFromDB();
  const restaurants = await getRestaurants();
  console.log("restaurants", restaurants);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuPage initialCategories={data} restaurants={restaurants} />
    </Suspense>
  );
}
