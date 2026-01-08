import { createClient } from "@/lib/supabase/server";
import React, { Suspense } from "react";
import MenuPage from "./_components/MenuPage";
import { getPublicCategoriesFromDB } from "@/services/server/ServerCategoryServices";
import { notFound } from "next/navigation";
import { getPublicRestaurantDetails } from "@/services/server/serverRestaurantServices";

const page = async (context: { params: Promise<{ restaurantId: string }> }) => {
  const { restaurantId } = await context.params;

  console.log("restaurantId", restaurantId);
  // Fetch restaurant details
  const restaurantDetails = await getPublicRestaurantDetails(restaurantId);

  console.log("restaurantDetails", restaurantDetails);

  // If restaurant not found, show 404 page
  if (!restaurantDetails) {
    return notFound(); // Next.js built-in 404 handler
  }

  // Fetch categories
  const categories = await getPublicCategoriesFromDB(restaurantId);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuPage
        initialCategories={categories || []}
        restaurantDetails={restaurantDetails}
      />
    </Suspense>
  );
};

export default page;
