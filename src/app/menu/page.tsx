import React, { Suspense } from "react";
import MenuPage from "./_components/MenuPage";
import { getCategoriesServerSide } from "@/services/server/ServerCategoryServices";

export default async function Page() {
  const data = await getCategoriesServerSide();

  // console.log("data from page", data);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuPage initialCategories={data} />
    </Suspense>
  );
}
