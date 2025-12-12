// Add a new category

import { serverAxiosInstance } from "@/lib/axios/ServerAxiosInstance";

import { serverService } from "@/lib/supabase/serverService";

// export async function getCategoriesServerSide() {
//   const { data: categories, error: categoriesError } = await serverService
//     .from("categories")
//     .select("*")
//     .order("position", { ascending: true });

//   const { data: products, error: productsError } = await serverService
//     .from("products")
//     .select("*, images:product_images(*)")
//     .order("position", { ascending: true });

//   if (categoriesError || productsError) {
//     throw new Error(categoriesError?.message || productsError?.message);
//   }

//   // Optional: structure products under categories
//   const structured = categories.map((cat) => ({
//     ...cat,
//     products: products.filter((p) => p.category_id === cat.id),
//   }));

//   return structured;
// }

export async function getCategoriesAPI() {
  try {
    const res = await serverAxiosInstance.get("/api/menu/structured"); // relative path works on client
    return res.data; // already parsed JSON
  } catch (error: any) {
    console.error(
      "Error fetching categories:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error || "Failed to fetch categories"
    );
  }
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
