"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  Hash,
  Settings,
  Utensils,
  X,
} from "lucide-react";

import React, { useState } from "react";
import ProductSearch from "./ProductSearch";
import ProductCard from "./ProductCard";
import { ProductCategoriesData } from "../../../../../../data/menu";
import { ProductCategoryTypes, ProductTypes } from "@/lib/types/menu-types";
import BouncingText from "@/components/animation/BouncingText";
import Link from "next/link";
import { useProductStore } from "@/app/stores/useProductStores";
import { useCartStore } from "@/app/stores/useCartStore";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesAPI } from "@/services/categoryServices";

const ProductsList = () => {
  // const categories = ProductCategoriesData;

  const [cartItems, setCartItems] = useState<ProductTypes[]>([]);
  const [total, setTotal] = useState(0);
  const { addToCart } = useCartStore();

  const { data: categories } = useQuery<ProductCategoryTypes[]>({
    queryKey: ["categories"],
    queryFn: getCategoriesAPI,
  });

  const handleAddToCart = (categoryId: string, product: ProductTypes) => {
    setCartItems((prev) => {
      const updated = [...prev, product];
      const newTotal = updated.reduce((sum, item) => sum + item.price, 0);
      setTotal(newTotal);
      return updated;
    });
    addToCart(product);
  };
  return (
    <>
      <div className="w-full h-full flex flex-col relative z-0">
        {/* Top section with search + sidebar */}
        <div className="flex flex-1 w-full pb-10">
          {/* <ProductSidebar categories={categories} /> */}

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <ProductSearch />
              <h2 className="text-gray-700 text-lg font-semibold mr-14">
                PRODUCTS
              </h2>
            </div>

            {categories?.map((category) => (
              <div key={category.id}>
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {category.products.map((p) => (
                    <div className="mb-6" key={p.id}>
                      <ProductCard
                        product={p}
                        onAddToCart={() => handleAddToCart(category.id, p)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section at the page bottom */}
        {/* {cartItems.length > 0 && (
          <div className="fixed right-74 bottom-0 z-10 w-[880px] flex bg-white border-t py-4 px-6 shadow-md  justify-between items-center">
            <>
              <div className="flex items-center">
                <span>{cartItems.length} Products</span>
                <BouncingText
                  text={`Rs ${(total / 100).toFixed(2)}`}
                  className="text-xl font-bold ml-4"
                />
              </div>
              <Button onClick={() => {}}>
                Confirm Order
                <ArrowUpRight />
              </Button>
            </>
          </div>
        )} */}
      </div>
    </>
  );
};

export default ProductsList;
