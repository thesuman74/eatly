import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addCategoryAPI } from "@/services/categoryServices";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";

export function useAddCategory() {
  const queryClient = useQueryClient();

  const restaurantId = useRestaurantStore((state) => state.restaurantId);
  console.log("restaurantId in useAddCategory", restaurantId);

  return useMutation({
    mutationFn: async () => {
      return await addCategoryAPI(restaurantId);
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
