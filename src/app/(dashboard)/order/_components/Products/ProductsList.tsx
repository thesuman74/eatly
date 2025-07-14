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
import ProductSidebar from "./ProductSidebar";
import ProductSearch from "./ProductSearch";
import ProductCategory from "./ProductCategories";

const ProductsList = () => {
  const categories = [
    {
      name: "Tea Specials",
      products: [
        { name: "Masala Tea", price: 5, img: "/images/coffee.png" },
        { name: "Green Tea", price: 4, img: "/images/coffee.png" },
        { name: "Lemon Tea", price: 5, img: "/images/coffee.png" },
        { name: "Product 4", price: 0, img: "/images/coffee.png" },
      ],
    },
    {
      name: "Desserts",
      products: [
        { name: "Chocolate cake", price: 22, img: "/images/coffee.png" },
        { name: "Açaí", price: 15, img: "/images/coffee.png" },
      ],
    },
    {
      name: "Drinks",
      products: [
        { name: "Water", price: 6, img: "/images/coffee.png" },
        { name: "Coca Cola", price: 8, img: "/images/coffee.png" },
      ],
    },
  ];
  return (
    <>
      <div className="w-full   h-full flex bg-white">
        {/* Sidebar */}
        <ProductSidebar categories={categories} />

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
            <ProductCategory
              key={category.name}
              name={category.name}
              products={category.products}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductsList;
