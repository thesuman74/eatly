// useUpdateCategoryPositions.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCategoryPositionsAPI,
  CategoryPositionUpdate,
} from "@/services/categoryServices";
import { toast } from "react-toastify";
import { useAdminCategoryStore } from "@/app/stores/useAdminCategoryStore";

export function useUpdateCategoryPositions(baseUrl: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: CategoryPositionUpdate[]) => {
      const data = await updateCategoryPositionsAPI(updates, baseUrl);
      return data;
    },
    onSuccess: (_data, variables) => {
      // Optimistic update: apply new positions locally
      const newCategories = variables.map((upd) => ({
        id: upd.id,
        position: upd.position,
      }));
      // setCategories(newCategories as any); // cast if needed
      toast.success("Category positions updated!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update positions");
    },
  });
}
