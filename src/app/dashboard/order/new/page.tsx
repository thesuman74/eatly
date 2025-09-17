import React, { Suspense } from "react";
import ProductOrdersheet from "@/components/sheet/ProductOrdersheet";
import ProductsList from "../_components/Products/ProductsList";
import ProductOrderSideBar from "../_components/Products/ProductOrderSideBar";

const page = () => {
  return (
    <div className="flex  w-full overflow-hidden relative">
      {/* Main content scrolls */}
      <div className="flex-grow h-full max-w-[70%]  ">
        <ProductsList />
      </div>
      {/* Sidebar */}
      <div className="fixed right-0  top-18 h-full ">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductOrderSideBar />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
