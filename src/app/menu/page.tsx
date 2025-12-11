import { getCategoriesAPI } from "@/services/categoryServices";
import React, { Suspense } from "react";
import MenuPage from "./_components/MenuPage";

export default async function Page() {
  const data = await getCategoriesAPI();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuPage initialCategories={data} />
    </Suspense>
  );
}
