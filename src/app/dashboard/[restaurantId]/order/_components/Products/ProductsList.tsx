"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Hash, Utensils, X } from "lucide-react";
import React, { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { ProductCategoryTypes, ProductTypes } from "@/lib/types/menu-types";
import { useCartStore } from "@/stores/admin/useCartStore";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesAPI } from "@/services/categoryServices";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { toast } from "react-toastify";

const ProductsList = () => {
  const restaurantId = useRestaurantStore((state) => state.restaurantId);
  const { addToCart } = useCartStore();

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories
  const { data: categories } = useQuery<ProductCategoryTypes[]>({
    queryKey: ["categories"],
    queryFn: () => getCategoriesAPI(restaurantId),
    enabled: !!restaurantId,
  });

  // Handle adding to cart
  const handleAddToCart = (product: ProductTypes) => {
    addToCart(product);
    toast.success("Product added to cart");
  };

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    if (!searchTerm) return categories;

    return categories
      .map((category) => {
        const filteredProducts = category.products.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        return { ...category, products: filteredProducts };
      })
      .filter((category) => category.products.length); // keep only categories with products
  }, [categories, searchTerm]);

  return (
    <div className="w-full h-full flex flex-col relative z-0">
      {/* Top search bar */}
      <div className="flex justify-between items-center p-4 ">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 mr-4 w-sm max-w-sm"
        />
      </div>

      {/* Product grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div key={category.id} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {category.products.map((p) => (
                  <div className="mb-6" key={p.id}>
                    <ProductCard
                      product={p}
                      onAddToCart={() => handleAddToCart(p)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">
            No products found for "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
