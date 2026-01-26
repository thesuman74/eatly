"use client";
import React, { Suspense, useState } from "react";
import ProductsList from "../_components/Products/ProductsList";
import ProductOrderSideBar from "../_components/Products/ProductOrderSideBar";
import { ShoppingBasket } from "lucide-react";
import { useCartStore } from "@/stores/admin/useCartStore";

const page = () => {
  const [showOrderSidebar, setShowOrderSidebar] = useState(false);
  const { cartItems } = useCartStore((state) => state);
  const cartCount = cartItems.length;
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
        <div className="fixed top-20 right-2 z-50">
          <div className="bg-secondary rounded-full">
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
              {cartCount}
            </span>
            <button
              className="p-2 rounded hover:bg-gray-100 transition"
              onClick={() => setShowOrderSidebar(true)}
            >
              <ShoppingBasket className="text-gray-600" size={30} />
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed right-0 top-16 h-full z-50">
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
