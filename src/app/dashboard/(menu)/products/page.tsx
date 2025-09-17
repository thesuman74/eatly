import CategoryList from "@/components/dashboard/DragAndDrop/CategoryList";
import { DragAndDropProvider } from "@/components/dashboard/DragAndDrop/DragAndDropContext";
import TopSection from "@/components/menu/TopSection";
import { Suspense } from "react";
import { ProductCategoriesData } from "../../../../../data/menu";

export const dynamic = "force-dynamic";

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let categoriesData: any[] = [];
  let error = null;

  try {
    const res = await fetch(`${baseUrl}/api/menu/structured`, {
      cache: "no-store", // ensures fresh fetch
    });

    if (!res.ok) {
      categoriesData = ProductCategoriesData;
      throw new Error(`Failed to fetch categories: ${res.status}`);
    }

    categoriesData = await res.json();

    if (!categoriesData || categoriesData.length === 0) {
      error = "No categories found.";
    }
  } catch (err: any) {
    console.error("Error fetching categories:", err);
    error = "Failed to load categories.";
  }

  // const categoriesData = ProductCategoriesData;

  console.log("categoriesData", categoriesData);

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50">
      <TopSection />

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <DragAndDropProvider initialCategories={categoriesData}>
            <CategoryList categoriesData={categoriesData} />
          </DragAndDropProvider>
        </Suspense>
      </div>
    </div>
  );
}
