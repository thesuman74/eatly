import CategoryList from "@/components/dashboard/DragAndDrop/CategoryList";
import { DragAndDropProvider } from "@/components/dashboard/DragAndDrop/DragAndDropContext";
import TopSection from "@/components/menu/TopSection";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50">
      {/* Top Section */}
      <TopSection />

      <div>
        <DragAndDropProvider>
          <CategoryList />
        </DragAndDropProvider>
      </div>
    </div>
  );
};

export default page;
