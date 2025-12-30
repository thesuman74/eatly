"use server";

import {
  addRestaurantAPI,
  deleteRestaurantAPI,
} from "@/services/restaurantServices";
import { createSubdomainAction } from "./createSubdomainAction";

interface CreateRestaurantInput {
  restaurantName: string;
  type: string;
  subdomain: string;
}

export async function createRestaurantWithSubdomain({
  restaurantName,
  type,
  subdomain,
}: CreateRestaurantInput) {
  try {
    if (!subdomain || !restaurantName || !type) {
      throw new Error("Missing required fields");
    }
    // 1. Create restaurant in DB
    const response = await addRestaurantAPI({ restaurantName, type });
    const restaurant = response.restaurant;
    console.log("restaurant", restaurant);
    console.log("resaruant id", restaurant.id);

    if (!restaurant?.id) {
      throw new Error("Failed to create restaurant");
    }

    // 2. Reserve subdomain in Redis
    await createSubdomainAction({
      subdomain,
      restaurantId: restaurant.id,
    });

    return restaurant; // success
  } catch (err: any) {
    // Optional: attempt rollback if restaurant created but subdomain failed
    console.error(err);
    if (err.restaurantId) {
      await deleteRestaurantAPI(err.restaurantId); // you need a delete API
    }
    throw err;
  }
}
