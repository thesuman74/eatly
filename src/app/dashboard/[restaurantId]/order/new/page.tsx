"use client";
import React, { Suspense, useState } from "react";
import ProductOrdersheet from "@/components/sheet/ProductOrdersheet";
import ProductsList from "../_components/Products/ProductsList";
import ProductOrderSideBar from "../_components/Products/ProductOrderSideBar";
import { ShoppingBasket } from "lucide-react";

const page = () => {
  const [showOrderSidebar, setShowOrderSidebar] = useState(false);
  return (
    <div className="flex  w-full overflow-hidden relative">
      {/* Main content scrolls */}
      <div
        className={`h-full overflow-y-auto transition-all duration-300 ${
          showOrderSidebar ? "md:w-[70%]" : "w-full"
        }`}
      >
        <ProductsList />
      </div>
      {/* Sidebar */}
      {!showOrderSidebar ? (
        // Basket button to open sidebar
        <div className="absolute top-2 right-2 bg-secondary rounded-full">
          <button
            className="p-2 rounded hover:bg-gray-100 transition"
            onClick={() => setShowOrderSidebar(true)}
          >
            <ShoppingBasket className="text-gray-600" size={30} />
          </button>
        </div>
      ) : (
        <div className="fixed right-0 top-18 h-full z-50">
          <ProductOrderSideBar
            open={showOrderSidebar}
            setOpen={setShowOrderSidebar}
          />
        </div>
      )}
    </div>
  );
};

export default page;
