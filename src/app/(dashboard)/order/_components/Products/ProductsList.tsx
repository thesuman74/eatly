"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Check,
  Clock,
  Hash,
  Settings,
  Utensils,
  X,
} from "lucide-react";

import React from "react";
import ProductSearch from "./ProductSearch";
import ProductCard from "./ProductCard";
import { ProductCategoriesData } from "../../../../../../data/menu";

const ProductsList = () => {
  const categories = ProductCategoriesData;

  return (
    <>
      <div className="w-full   h-full flex bg-white">
        {/* Sidebar */}
        {/* <ProductSidebar categories={categories} /> */}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <ProductSearch />
            <h2 className="text-gray-700 text-lg font-semibold">
              <div className="space-x-4 flex">
                <span>
                  <Settings />
                </span>
                <span>PRODUCTS</span>
              </div>
            </h2>
          </div>

          {categories.map((category) => (
            <div key={category.id}>
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {category.products.map((p) => (
                  <div className="mb-6" key={p.id}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductsList;
