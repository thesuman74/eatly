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

type ProductImageItem =
  | { type: "file"; file: File }
  | { type: "url"; url: string };

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
      images?: ProductImageItem[];
    }) => {
      if (!restaurantId) throw new Error("No active restaurant selected");

      // 1️⃣ Create product first
      const product = await addProductAPI({
        name: payload.name,
        description: payload.description,
        price: payload.price,
        category_id: payload.category_id,
        restaurantId,
      });

      // 2️⃣ Separate uploaded files and fetched URLs
      const fileImages =
        payload.images?.filter(
          (img): img is { type: "file"; file: File } => img.type === "file",
        ) || [];

      const urlImages =
        payload.images
          ?.filter(
            (img): img is { type: "url"; url: string } => img.type === "url",
          )
          .map((img) => img.url) || [];

      // 3️⃣ Upload files if any
      let uploadedUrls: string[] = [];
      if (fileImages.length > 0) {
        uploadedUrls = await uploadProductImages(
          product.id,
          fileImages.map((i) => i.file),
        );
      }

      // 4️⃣ Combine uploaded and fetched URLs
      const allUrls = [...uploadedUrls, ...urlImages];

      // 5️⃣ Insert image records
      if (allUrls.length > 0) {
        const res = await fetch("/api/menu/products/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            imageName: product.name,
            images: allUrls,
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
      product_id: string;
      name: string;
      description: string;
      price: number;
      category_id: string;
      images?: ProductImageItem[];
    }) => {
      if (!restaurantId) throw new Error("No active restaurant selected");

      // 1️⃣ Update product first
      const product = await updateProductAPI({ ...payload }, restaurantId);

      // 2️⃣ Separate uploaded files and fetched URLs
      const fileImages =
        payload.images?.filter(
          (img): img is { type: "file"; file: File } => img.type === "file",
        ) || [];

      const urlImages =
        payload.images
          ?.filter(
            (img): img is { type: "url"; url: string } => img.type === "url",
          )
          .map((img) => img.url) || [];

      // 3️⃣ Upload files if any
      let uploadedUrls: string[] = [];
      if (fileImages.length > 0) {
        uploadedUrls = await uploadProductImages(
          product.id,
          fileImages.map((i) => i.file),
        );
      }

      // 4️⃣ Combine uploaded and fetched URLs
      const allUrls = [...uploadedUrls, ...urlImages];

      // 5️⃣ Insert image records if any
      if (allUrls.length > 0) {
        const res = await fetch("/api/menu/products/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            imageName: product.name,
            images: allUrls,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to insert images");
      }

      return product;
    },

    onSuccess: () => {
      toast.success("Product updated successfully!");
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
