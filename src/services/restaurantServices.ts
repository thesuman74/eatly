import { clientAxiosInstance } from "@/lib/axios/ClientAxiosInstance";
import { AddRestaurantPayload } from "@/lib/types/resturant-types";

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
