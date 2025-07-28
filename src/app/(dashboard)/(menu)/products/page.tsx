// app/(dashboard)/menu/page.tsx or similar
import CategoryList from "@/components/dashboard/DragAndDrop/CategoryList";
import { DragAndDropProvider } from "@/components/dashboard/DragAndDrop/DragAndDropContext";
import TopSection from "@/components/menu/TopSection";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/menu/structured`);
  const categoriesData = await res.json();

  console.log("categoriesData", categoriesData);

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50">
      <TopSection />

      <div>
        <DragAndDropProvider initialCategories={categoriesData}>
          <CategoryList categoriesData={categoriesData} />
        </DragAndDropProvider>
      </div>
    </div>
  );
}
