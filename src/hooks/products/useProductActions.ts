import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProductAPI, updateProductAPI } from "@/services/productServices";
import { uploadProductImages } from "@/lib/actions/uploadImages";
import { toast } from "react-toastify";

export function useProductActions() {
  const queryClient = useQueryClient();

  const addProduct = useMutation({
    mutationFn: async (payload: {
      name: string;
      description: string;
      price: number;
      category_id: string;
      images?: File[];
    }) => {
      // 1️⃣ Create product
      let product;
      try {
        product = await addProductAPI({
          name: payload.name,
          description: payload.description,
          price: payload.price,
          category_id: payload.category_id,
        });
      } catch (err: any) {
        throw new Error(err.message || "Failed to create product");
      }

      // 2️⃣ Upload images only if product creation succeeded
      if (payload.images && payload.images.length > 0) {
        const urls = await uploadProductImages(product.id, payload.images);

        // 3️⃣ Insert image records via API
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
      toast.success("Product added successfully!");
      // 4️⃣ Refetch products after everything is done
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
      const product = await updateProductAPI({
        product_id: payload.product_id,
        name: payload.name,
        description: payload.description,
        price: payload.price,
        category_id: payload.category_id,
      });

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

  return { addProduct, updateProduct };
}
