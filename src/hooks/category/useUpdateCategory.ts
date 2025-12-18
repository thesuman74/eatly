import { updateCategoriesAPI } from "@/services/categoryServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useUpdateCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategoriesAPI,
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
