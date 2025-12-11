// useDuplicateCategory.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { duplicateCategoryAPI } from "@/services/categoryServices";
import { toast } from "react-toastify";
import { useAdminCategoryStore } from "@/app/stores/useAdminCategoryStore";

export function useDuplicateCategory() {
  const queryClient = useQueryClient();
  const addCategoryLocal = useAdminCategoryStore((s) => s.addCategory);

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const data = await duplicateCategoryAPI(categoryId);
      return data.category;
    },
    onSuccess: (category) => {
      addCategoryLocal(category);
      toast.success("Category duplicated successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to duplicate category");
    },
  });
}
