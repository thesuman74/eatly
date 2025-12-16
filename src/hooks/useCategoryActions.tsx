import { useState } from "react";
import { toast } from "react-toastify";
import { adminCategoryStore } from "@/stores/admin/adminCategoryStore";
import {
  addCategoryAPI,
  CategoryPositionUpdate,
  deleteCategoryAPI,
  duplicateCategoryAPI,
  toggleCategoryVisibilityAPI,
  updateCategoryNameAPI,
  updateCategoryPositionsAPI,
} from "@/services/categoryServices";

export function useCategoryActions() {
  const addCategory = adminCategoryStore((s) => s.addCategory);
  const [isLoading, setIsLoading] = useState(false);

  const categories = adminCategoryStore((s) => s.categories);
  const setCategories = adminCategoryStore((s) => s.setCategories);
  const toggleVisibility = adminCategoryStore(
    (s) => s.toggleCategoryVisibility
  );
  const deleteCategory = adminCategoryStore((s) => s.deleteCategory);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const handleAddCategory = async () => {
    try {
      setIsLoading(true);

      // Call the service
      const category = await addCategoryAPI();

      // Update Zustand store
      addCategory(category);

      // Show success
      toast.success("Category added successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to add category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePositions = async (newCategories: typeof categories) => {
    try {
      const updates: CategoryPositionUpdate[] = newCategories.map((c, i) => ({
        id: c.id,
        position: i + 1, // 1-based
      }));

      const data = await updateCategoryPositionsAPI(updates, baseUrl);

      // Update local Zustand state
      setCategories(newCategories);

      toast.success(data.message || "Positions updated successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update positions");
    }
  };

  // Update category name
  const handleUpdateCategoryName = async (categoryId: string, name: string) => {
    console.log("handleUpdateCategoryName", handleUpdateCategoryName);
    try {
      setIsLoading(true);
      const data = await updateCategoryNameAPI(categoryId, name);
      toast.success("Category updated successfully");
      // Update local state
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? { ...cat, name } : cat
        )
      );
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update category");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  // Duplicate category
  const handleDuplicateCategory = async (categoryId: string) => {
    try {
      const data = await duplicateCategoryAPI(categoryId);
      addCategory(data.category);
      toast.success(data.message || "Category duplicated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to duplicate category");
    }
  };

  // Toggle visibility
  const handleToggleVisibility = async (categoryId: string) => {
    try {
      toggleVisibility(categoryId); // Optimistic update
      const data = await toggleCategoryVisibilityAPI(categoryId);
      toast.success(data.message || "Visibility toggled!");
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle visibility");
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId); // Updates Zustand state
      await deleteCategoryAPI(categoryId);
      toast.success("Category deleted!");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  return {
    categories,
    setCategories,
    handleAddCategory,
    handleUpdatePositions,
    isLoading,
    addCategory,
    handleUpdateCategoryName,
    handleDuplicateCategory,
    handleToggleVisibility,
    handleDeleteCategory,
  };
}
