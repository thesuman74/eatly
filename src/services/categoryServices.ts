// Add a new category

import { ProductCategoryTypes } from "@/lib/types/menu-types";

export async function getCategoriesAPI(): Promise<ProductCategoryTypes[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/menu/structured`, {
    cache: "no-store", // ensures fresh fetch
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch categories");
  }

  return data;
}
export async function addCategoryAPI() {
  const response = await fetch("/api/menu/categories/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to add category");
  }

  return data.category;
}

export interface CategoryPositionUpdate {
  id: string;
  position: number;
}

export async function updateCategoryPositionsAPI(
  updates: CategoryPositionUpdate[],
  baseUrl: string
) {
  const response = await fetch(
    `${baseUrl}/api/menu/categories/update/positions`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update positions");
  }

  return data; // { success: boolean, message?: string }
}

export async function updateCategoryNameAPI(categoryId: string, name: string) {
  const res = await fetch("/api/menu/categories/update/name", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryId, name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update category name");
  return data;
}

export async function duplicateCategoryAPI(categoryId: string) {
  const res = await fetch("/api/menu/categories/duplicate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryId }),
  });
  const data = await res.json();
  console.log("duplicated data", data);
  if (!res.ok) throw new Error(data.error || "Failed to duplicate category");
  return data;
}

export async function toggleCategoryVisibilityAPI(categoryId: string) {
  const res = await fetch("/api/menu/categories/toggle-visibility", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryId }),
  });
  const data = await res.json();
  console.log("data", data);
  if (!res.ok) throw new Error(data.error || "Failed to toggle visibility");
  return data;
}

export async function deleteCategoryAPI(categoryId: string) {
  const res = await fetch(
    `/api/menu/categories/delete?categoryId=${categoryId}`,
    {
      method: "DELETE",
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete category");
  return data;
}
