"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MoveLeft, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/ui/SubmitButton";
import { ProductCategoryTypes } from "@/lib/types/menu-types";

interface PreviewMenuFormProps {
  reviewMenu: boolean;
  setReviewMenu: (open: boolean) => void;
  reviewMenuData: ProductCategoryTypes[];
  setReviewMenuData: React.Dispatch<
    React.SetStateAction<ProductCategoryTypes[]>
  >;
}

export default function PreviewMenuForm({
  reviewMenu,
  setReviewMenu,
  reviewMenuData,
  setReviewMenuData,
}: PreviewMenuFormProps) {
  const queryClient = useQueryClient();
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategoryTypes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!selectedCategory && reviewMenuData.length > 0) {
      setSelectedCategory(reviewMenuData[0]);
    } else if (selectedCategory) {
      // update selectedCategory reference from the updated reviewMenuData
      const updatedCategory = reviewMenuData.find(
        (cat) => cat.id === selectedCategory.id,
      );
      if (updatedCategory) setSelectedCategory(updatedCategory);
    }
  }, [reviewMenuData]);

  if (!reviewMenuData) return <div>Loading menu data...</div>;
  if (reviewMenuData.length === 0) return <div>No menu data available.</div>;

  const saveToLocalStorage = (data: ProductCategoryTypes[]) => {
    localStorage.setItem("extracted_menu", JSON.stringify(data));
  };

  const handleProductChange = (
    productId: string,
    field: string,
    value: any,
  ) => {
    if (!selectedCategory) return;

    const updatedCategory = {
      ...selectedCategory,
      products: selectedCategory.products.map((p) =>
        p.id === productId ? { ...p, [field]: value } : p,
      ),
    };

    setSelectedCategory(updatedCategory);

    setReviewMenuData((prev) => {
      const newData = prev.map((cat) =>
        cat.id === updatedCategory.id ? updatedCategory : cat,
      );
      saveToLocalStorage(newData);
      return newData;
    });
  };

  const handleRemoveProduct = (productId: string) => {
    if (!selectedCategory) return;

    const updatedCategory = {
      ...selectedCategory,
      products: selectedCategory.products.filter((p) => p.id !== productId),
    };

    setSelectedCategory(updatedCategory);

    setReviewMenuData((prev) => {
      const newData = prev.map((cat) =>
        cat.id === updatedCategory.id ? updatedCategory : cat,
      );
      saveToLocalStorage(newData);
      return newData;
    });
  };

  const handleRemoveCategory = (categoryId: string) => {
    const newData = reviewMenuData.filter((cat) => cat.id !== categoryId);
    setReviewMenuData(newData);
    saveToLocalStorage(newData);

    if (newData.length > 0) {
      setSelectedCategory(newData[0]);
    } else {
      setSelectedCategory(null);
    }
  };

  const handleSubmitWithImages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/menu/import-with-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewMenuData, restaurantId }),
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed to import menu with images");

      toast.success("Menu with images imported successfully!");
      setReviewMenu(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-6xl mx-auto mt-10 p-4 shadow-lg">
      <CardHeader className="relative p-0 pb-4 border-b flex justify-center items-center">
        <MoveLeft
          className="absolute left-0 cursor-pointer text-gray-600 hover:text-gray-900"
          onClick={() => setReviewMenu(false)}
          size={24}
        />
        <CardTitle className="text-2xl font-semibold">
          Review Extracted Menu
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 max-h-[75vh] overflow-y-auto">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-6 ">
          {reviewMenuData.map((cat) => (
            <div key={cat.id} className="flex relative items-center gap-2">
              <Button
                variant={
                  selectedCategory?.id === cat.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(cat)}
                size="sm"
              >
                {cat.name} ({cat.products.length})
              </Button>
              <X
                className="absolute -top-2 right-0 cursor-pointer text-red-500 hover:text-red-700 bg-background rounded-full"
                size={18}
                onClick={() => handleRemoveCategory(cat.id)}
              />
            </div>
          ))}
        </div>

        {/* Products Grid */}
        {selectedCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {selectedCategory.products.map((product) => (
              <Card key={product.id} className="p-4 flex flex-col gap-4">
                <CardContent className="p-0 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`name-${product.id}`}>Name</Label>
                    <Trash2
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      size={18}
                      onClick={() => handleRemoveProduct(product.id)}
                    />
                  </div>
                  <Input
                    id={`name-${product.id}`}
                    value={product.name}
                    onChange={(e) =>
                      handleProductChange(product.id, "name", e.target.value)
                    }
                    className="mt-1"
                  />

                  <div>
                    <Label htmlFor={`price-${product.id}`}>Price (NPR)</Label>
                    <Input
                      type="number"
                      value={product.price}
                      onChange={(e) =>
                        handleProductChange(
                          product.id,
                          "price",
                          Number(e.target.value),
                        )
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`desc-${product.id}`}>Description</Label>
                    <Textarea
                      value={product.description || ""}
                      onChange={(e) =>
                        handleProductChange(
                          product.id,
                          "description",
                          e.target.value,
                        )
                      }
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center mt-4 pb-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitWithImages();
            }}
          >
            <SubmitButton
              isLoading={isLoading}
              disabled={isLoading}
              className="px-6 py-3 text-lg"
            >
              Submit Menu
            </SubmitButton>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
