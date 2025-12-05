import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProductAPI } from "@/services/productServices";
import { toast } from "react-toastify";

export function useProductActions() {
  const queryClient = useQueryClient();

  const addProduct = useMutation({
    mutationFn: addProductAPI,

    onSuccess: () => {
      toast.success("Product added successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] }); // refresh list
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to add product");
    },
  });

  return { addProduct };
}
