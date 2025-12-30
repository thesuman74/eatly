"use client";

import { X } from "lucide-react";
import { useOrderWorkspace } from "@/stores/workspace/useOrderWorkspace";
import ProductOrdersheet from "@/components/sheet/ProductOrdersheet";
import ProductsList from "./Products/ProductsList";

export default function OrderWorkspace() {
  const { isProductListOpen, closeProductList } = useOrderWorkspace();

  return (
    <>
      <div className="flex w-full h-full overflow-hidden">
        {/* LEFT: Products List */}
        {isProductListOpen && (
          <div className="fixed right-[384px] top-[64px] h-full w-[890px] border-r bg-white z-50 shadow-lg flex flex-col">
            {/* Header with Close Button */}
            <div className=" flex justify-end p-1 border-b">
              <button
                onClick={closeProductList}
                className="p-2 rounded hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto">
              <ProductsList />
            </div>
          </div>
        )}

        {/* RIGHT: Order Sheet */}
        <div className="w-[380px] border-l bg-white">
          <ProductOrdersheet />
        </div>
      </div>
    </>
  );
}
