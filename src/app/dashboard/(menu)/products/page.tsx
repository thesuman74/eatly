import CategoryList from "@/components/dashboard/DragAndDrop/CategoryList";
import { DragAndDropProvider } from "@/components/dashboard/DragAndDrop/DragAndDropContext";
import TopSection from "@/components/menu/TopSection";
import { getCategoriesFromDB } from "@/services/server/ServerCategoryServices";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Page() {
  const categoriesData = await getCategoriesFromDB();

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50">
      <TopSection />

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
