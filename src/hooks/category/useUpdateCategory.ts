import {
  CategoryUpdate,
  updateCategoriesAPI,
} from "@/services/categoryServices";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useUpdateCategories() {
  const queryClient = useQueryClient();
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  return useMutation({
    mutationFn: (updates: CategoryUpdate[]) =>
      updateCategoriesAPI(updates, restaurantId),
    onSuccess: () => {
      toast.success("Categories updated!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update categories");
      console.error(error);
    },
  });
}
