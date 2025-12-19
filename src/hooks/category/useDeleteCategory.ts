// useDeleteCategory.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryAPI } from "@/services/categoryServices";
import { toast } from "react-toastify";
import { adminCategoryStore } from "@/stores/admin/adminCategoryStore";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const deleteCategoryLocal = adminCategoryStore((s) => s.deleteCategory);
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  return useMutation({
    mutationFn: async (categoryId: string) => {
      await deleteCategoryAPI(categoryId, restaurantId);
      return categoryId;
    },
    onMutate: (categoryId) => {
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
