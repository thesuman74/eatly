"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import { ProductCategoryTypes } from "@/lib/types/menu-types";
import { Textarea } from "@/components/ui/textarea";
import { set } from "react-hook-form";
import SubmitButton from "@/components/ui/SubmitButton";
import { useQueryClient } from "@tanstack/react-query";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";

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

  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategoryTypes | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  useEffect(() => {
    if (reviewMenuData && reviewMenuData.length > 0) {
      setSelectedCategory(reviewMenuData[0]);
    }
  }, [reviewMenuData]);

  if (!reviewMenuData) return <div>Loading menu data...</div>;
  if (reviewMenuData.length === 0) return <div>No menu data available.</div>;

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/menu/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewMenuData, restaurantId }), // send array directly
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to import menu");
      }

      toast.success("Menu imported successfully!");

      setReviewMenu(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitWithImages = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/menu/import-with-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewMenuData, restaurantId }), // send menu JSON only
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to import menu with images");
      }

      toast.success("Menu with images imported successfully!");

      setReviewMenu(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
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

    // Also update the main reviewMenuData so that edits persist when switching categories
    setReviewMenuData((prev) => {
      const newData = prev.map((cat) =>
        cat.id === updatedCategory.id ? updatedCategory : cat,
      );

      // update localStorage with new data
      localStorage.setItem("extracted_menu", JSON.stringify(newData));

      return newData;
    });
  };

  return (
    <Card className="max-w-6xl mx-auto mt-10 p-4 shadow-lg">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-4 p-0 pb-4 border-b">
        <MoveLeft
          className="cursor-pointer text-gray-600 hover:text-gray-900"
          onClick={() => setReviewMenu(false)}
          size={24}
        />
        <CardTitle className="text-2xl font-semibold">
          Review Extracted Menu
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 max-h-[75vh] overflow-y-auto">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {reviewMenuData.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory?.id === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              size="sm"
            >
              {cat.name} ({cat.products.length})
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {selectedCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {selectedCategory.products.map((product) => (
              <Card key={product.id} className="p-4 flex flex-col gap-4">
                <CardHeader className="p-0 flex justify-center">
                  {/* <img
                    src={product.image.url}
                    alt={product.image.alt}
                    className="size-24 object-cover rounded-lg"
                  /> */}
                </CardHeader>

                <CardContent className="p-0 flex flex-col gap-3">
                  <div>
                    <Label htmlFor={`name-${product.id}`}>Name</Label>
                    <Input
                      id={`name-${product.id}`}
                      value={product.name} // bind value to state
                      onChange={(e) =>
                        handleProductChange(product.id, "name", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

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
        {/* <div className="flex justify-center mt-4 pb-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <SubmitButton isLoading={isLoading} className="px-6 py-3 text-lg">
              Submit Menu
            </SubmitButton>
          </form>
        </div> */}
        <div className="flex justify-center mt-4 pb-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitWithImages();
            }}
          >
            <SubmitButton isLoading={isLoading} className="px-6 py-3 text-lg">
              Submit Menu
            </SubmitButton>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
