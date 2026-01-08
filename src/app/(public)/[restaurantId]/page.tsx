import { createClient } from "@/lib/supabase/server";
import React, { Suspense } from "react";
import { getPublicCategoriesFromDB } from "@/services/server/ServerCategoryServices";
import { notFound } from "next/navigation";
import MenuPage from "./menu/_components/MenuPage";
import RestaurantHome from "./RestaurantHome";
import { getPublicRestaurantDetails } from "@/services/server/serverRestaurantServices";
import { getRestaurantBySubdomain, getSubdomainData } from "@/lib/redis";
import MenuPageSkeleton from "./menu/_components/MenuPageSkeleton";

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

  return (
    <Suspense fallback={<MenuPageSkeleton />}>
      <RestaurantHome
        restaurantId={restaurantId}
        restaurantDetails={restaurantDetails}
      />
    </Suspense>
  );
};

export default page;
