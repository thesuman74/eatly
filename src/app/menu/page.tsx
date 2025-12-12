import React, { Suspense } from "react";
import MenuPage from "./_components/MenuPage";
import { getCategoriesFromDB } from "@/services/server/ServerCategoryServices";

export default async function Page() {
  const data = await getCategoriesFromDB();

  // console.log("data from page", data);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuPage initialCategories={data} />
    </Suspense>
  );
}
