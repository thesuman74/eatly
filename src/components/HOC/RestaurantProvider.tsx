"use client";

import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { useEffect } from "react";

interface Restaurant {
  id: string;
  name: string;
  [key: string]: any; // keep the rest of the properties optional
}

interface RestaurantProviderProps {
  restaurants: Restaurant[];
  children: React.ReactNode;
}

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({
  restaurants,
  children,
}) => {
  return <>{children}</>;
};
