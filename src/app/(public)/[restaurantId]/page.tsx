import { createClient } from "@/lib/supabase/server";
import React, { Suspense } from "react";
import { getPublicCategoriesFromDB } from "@/services/server/ServerCategoryServices";
import { notFound } from "next/navigation";
import MenuPage from "./menu/_components/MenuPage";
import RestaurantHome from "./RestaurantHome";
import { getPublicRestaurantDetails } from "@/services/server/serverRestaurantServices";
import { getRestaurantBySubdomain, getSubdomainData } from "@/lib/redis";

const page = async ({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) => {
  const paramsData = await params;
  const restaurantId = paramsData.restaurantId;
  // const subdomainData = await getSubdomainData(restaurantId);
  // console.log("subdomainData", subdomainData);

  // if (!subdomainData) {
  //   notFound();
  // }

  const restaurantDetails = await getPublicRestaurantDetails(restaurantId);
  if (!restaurantDetails) return notFound();
  console.log("restaurantDetails", restaurantDetails);

  // const restaurantId = restaurantDetails.restaurantId;

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
