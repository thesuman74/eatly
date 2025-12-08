import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateCategoryNameAPI } from "@/services/categoryServices";

export function useUpdateCategoryName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryId,
      name,
    }: {
      categoryId: string;
      name: string;
    }) => {
      return await updateCategoryNameAPI(categoryId, name);
    },
    onSuccess: (_, { categoryId, name }) => {
      // Optimistic update of cached categories
      queryClient.setQueryData(["categories"], (old: any) =>
        old.map((cat: any) => (cat.id === categoryId ? { ...cat, name } : cat))
      );
      toast.success("Category updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update category");
    },
  });
}
