import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addProductAPI,
  deleteProductAPI,
  duplicateProductAPI,
  toggleProductVisibilityAPI,
  updateProductAPI,
} from "@/services/productServices";
import { uploadProductImages } from "@/lib/actions/uploadImages";
import { toast } from "react-toastify";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";

export function useProductActions() {
  const queryClient = useQueryClient();
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  if (!restaurantId) {
    throw new Error("No active restaurant selected");
  }

  const addProduct = useMutation({
    mutationFn: async (payload: {
      name: string;
      description: string;
      price: number;
      category_id: string;
      images?: File[];
    }) => {
      if (!restaurantId) {
        throw new Error("No active restaurant selected");
      }

      // 1️⃣ Create product
      const product = await addProductAPI({
        name: payload.name,
        description: payload.description,
        price: payload.price,
        category_id: payload.category_id,
        restaurantId,
      });

      // 2️⃣ Upload images only after product exists
      if (payload.images?.length) {
        const urls = await uploadProductImages(product.id, payload.images);

        // 3️⃣ Insert image records
        const res = await fetch("/api/menu/products/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            imageName: product.name,
            images: urls,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to insert images");
      }

      return product;
    },

    onSuccess: () => {
      toast.success("Product added successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to add product");
    },
  });

  const updateProduct = useMutation({
    mutationFn: async (payload: {
      product_id: string; // ✅ Product ID for update
      name: string;
      description: string;
      price: number;
      category_id: string;
      images?: File[]; // ✅ Optional new images
    }) => {
      // 1️⃣ Update product
      const product = await updateProductAPI({ ...payload }, restaurantId);

      // 2️⃣ Upload new images if any
      if (payload.images && payload.images.length > 0) {
        const urls = await uploadProductImages(product.id, payload.images);

        // 3️⃣ Insert new images via API route
        const res = await fetch("/api/menu/products/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            ImageName: product.name,
            images: urls,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to insert images");
      }

      return product;
    },

    onSuccess: () => {
      toast.success("Product updated successfully!");
      // ✅ Invalidate categories to refresh the list
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (productId: string) =>
      deleteProductAPI(productId, restaurantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Product deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  // Duplicate product mutation
  const duplicateMutation = useMutation({
    mutationFn: (productId: string) => duplicateProductAPI(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Product duplicated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to duplicate product");
    },
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: (productId: string) => toggleProductVisibilityAPI(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Product visibility updated!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to toggle product visibility");
    },
  });

  return {
    addProduct,
    updateProduct,
    deleteMutation,
    duplicateMutation,
    toggleVisibilityMutation,
  };
}
