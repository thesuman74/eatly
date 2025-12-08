import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addCategoryAPI } from "@/services/categoryServices";

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await addCategoryAPI();
    },
    onSuccess: (category) => {
      // Invalidate categories or append to cached categories
      queryClient.setQueryData(["categories"], (old: any) => [
        ...(old || []),
        category,
      ]);
      toast.success("Category added successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add category");
    },
  });
}
