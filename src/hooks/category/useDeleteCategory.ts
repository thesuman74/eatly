// useDeleteCategory.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryAPI } from "@/services/categoryServices";
import { toast } from "react-toastify";
import { adminCategoryStore } from "@/stores/admin/adminCategoryStore";

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const deleteCategoryLocal = adminCategoryStore((s) => s.deleteCategory);

  return useMutation({
    mutationFn: async (categoryId: string) => {
      await deleteCategoryAPI(categoryId);
      return categoryId;
    },
    onMutate: (categoryId) => {
      // Optimistic update: remove category locally first
      deleteCategoryLocal(categoryId);
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete category");
    },
  });
}
