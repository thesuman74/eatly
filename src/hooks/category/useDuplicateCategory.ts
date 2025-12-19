// useDuplicateCategory.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { duplicateCategoryAPI } from "@/services/categoryServices";
import { toast } from "react-toastify";
import { adminCategoryStore } from "@/stores/admin/adminCategoryStore";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";

export function useDuplicateCategory() {
  const queryClient = useQueryClient();
  const addCategoryLocal = adminCategoryStore((s) => s.addCategory);

  const restaurantId = useRestaurantStore((state) => state.restaurantId);
  return useMutation({
    mutationFn: async (categoryId: string) => {
      const data = await duplicateCategoryAPI(categoryId, restaurantId);
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
