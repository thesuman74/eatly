import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { toggleCategoryVisibilityAPI } from "@/services/categoryServices";

export function useToggleCategoryVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      return await toggleCategoryVisibilityAPI(categoryId);
    },
    onSuccess: (_, categoryId) => {
      queryClient.setQueryData(["categories"], (old: any) =>
        old.map((cat: any) =>
          cat.id === categoryId ? { ...cat, visible: !cat.visible } : cat
        )
      );
      toast.success("Visibility toggled!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to toggle visibility");
    },
  });
}
