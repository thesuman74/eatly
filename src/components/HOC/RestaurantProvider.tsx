"use client";

import { useEffect, useRef } from "react";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";

interface Restaurant {
  id: string;
  name: string;
  [key: string]: any;
}

interface RestaurantProviderProps {
  restaurants: Restaurant[];
  children: React.ReactNode;
}

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({
  restaurants,
  children,
}) => {
  const { restaurantId, setRestaurant } = useRestaurantStore();
  const hasHydrated = useRestaurantStore.persist.hasHydrated();

  // Prevent double initialization (StrictMode, rerenders)
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (initializedRef.current) return;
    if (!restaurants || restaurants.length === 0) return;

    initializedRef.current = true;

    // 1. If persisted restaurant exists AND is valid → keep it
    const persistedExists = restaurants.some((r) => r.id === restaurantId);

    if (persistedExists) {
      return;
    }

    // 2. Otherwise, fall back safely
    const fallback = restaurants[0];
    setRestaurant(fallback.id, fallback.name);
  }, [hasHydrated, restaurants, restaurantId, setRestaurant]);

  return <>{children}</>;
};
