// Add a new category

import { clientAxiosInstance } from "@/lib/axios/ClientAxiosInstance";

export async function getCategoriesAPI(restaurantId: string) {
  console.log("getCategoriesAPI", restaurantId);

  try {
    const res = await fetch(
      `/api/menu/structured?restaurantId=${restaurantId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await res.json();

    return data || [];
  } catch (error: any) {
    console.error("Error fetching categories:", error.message);
    return [];
  }
}

export async function addCategoryAPI(restaurantId: string) {
  try {
    const res = await clientAxiosInstance.post(
      "/api/menu/categories",
      { restaurantId }
      // { requiresAuth: true }
    );
    return res.data;
  } catch (error: any) {
    console.error(
      "Error adding categories:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.error || "Failed to add categories");
  }
}

export interface CategoryUpdate {
  id: string;
  name?: string;
  position?: number;
  isVisible?: boolean;
}

export async function updateCategoriesAPI(
  updates: CategoryUpdate[],
  restaurantId: string
) {
  const response = await fetch(`/api/menu/categories`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updates, restaurantId }), // no restaurantId needed
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update categories");
  }

  return data;
}

export async function duplicateCategoryAPI(
  categoryId: string,
  restaurantId: string
) {
  const res = await fetch("/api/menu/categories/duplicate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryId, restaurantId }),
  });
  const data = await res.json();
  console.log("duplicated data", data);
  if (!res.ok) throw new Error(data.error || "Failed to duplicate category");
  return data;
}

export async function deleteCategoryAPI(
  categoryId: string,
  restaurantId: string
) {
  const res = await fetch(`/api/menu/categories?categoryId=${categoryId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ restaurantId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete category");
  return data;
}
