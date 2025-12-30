"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategoriesAPI } from "@/services/categoryServices";
import { ProductCategoryTypes, ProductTypes } from "@/lib/types/menu-types";
import ProductCard from "./ProductCard";
import ProductSearch from "./ProductSearch";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";

interface ProductGridProps {
  onProductClick?: (product: ProductTypes) => void;
}

export default function ProductGrid({ onProductClick }: ProductGridProps) {
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  const { data: categories, isLoading } = useQuery<ProductCategoryTypes[]>({
    queryKey: ["categories"],
    queryFn: () => getCategoriesAPI(restaurantId),
  });

  if (isLoading) return <div className="p-4">Loading products...</div>;

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <ProductSearch />
        <h2 className="text-gray-700 text-lg font-semibold">PRODUCTS</h2>
      </div>

      {categories?.map((category) => (
        <div key={category.id}>
          <h3 className="text-lg font-semibold mb-2">{category.name}</h3>

          <div className="grid grid-cols-2 gap-3">
            {category.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => onProductClick?.(product)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
