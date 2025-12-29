import { createClient } from "@/lib/supabase/server";
import React, { Suspense } from "react";
import { getPublicCategoriesFromDB } from "@/services/server/ServerCategoryServices";
import { notFound } from "next/navigation";
import MenuPage from "./menu/_components/MenuPage";
import RestaurantHome from "./RestaurantHome";
import { getPublicRestaurantDetails } from "@/services/server/serverRestaurantServices";

const page = async (context: { params: Promise<{ restaurantId: string }> }) => {
  const { restaurantId } = await context.params;

  // Fetch restaurant details
  const restaurantDetails = await getPublicRestaurantDetails(restaurantId);

  // If restaurant not found, show 404 page
  if (!restaurantDetails) {
    return notFound(); // Next.js built-in 404 handler
  }

  // Fetch categories
  const categories = await getPublicCategoriesFromDB(restaurantId);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RestaurantHome
        restaurantId={restaurantId}
        restaurantDetails={restaurantDetails}
      />
    </Suspense>
  );
};

export default page;
