import { clientAxiosInstance } from "@/lib/axios/ClientAxiosInstance";
import { AddRestaurantPayload } from "@/lib/types/resturant-types";

export async function getUserRestaurantsAPI(restaurantId: string) {
  try {
    const res = await fetch(`/api/restaurant?restaurantId=${restaurantId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error(
      "Error fetching restaurant:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error || "Failed to fetch categories"
    );
  }
}

export async function addRestaurantAPI(payload: AddRestaurantPayload) {
  try {
    const response = await clientAxiosInstance.post(
      "/api/restaurant",
      payload,
      {
        requiresAuth: true,
      }
    );

    return response.data; //
  } catch (error: any) {
    // handle axios error
    const message =
      error?.response?.data?.error ||
      error.message ||
      "Failed to add restaurant";
    throw new Error(message);
  }
}

export async function deleteRestaurantAPI(restaurantId: string) {
  try {
    const response = await clientAxiosInstance.delete(
      `/api/restaurant?restaurantId=${restaurantId}`,
      {
        requiresAuth: true,
      }
    );

    return response.data; //
  } catch (error: any) {
    // handle axios error
    const message =
      error?.response?.data?.error ||
      error.message ||
      "Failed to delete restaurant";
    throw new Error(message);
  }
}
