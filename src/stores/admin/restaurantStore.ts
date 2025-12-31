import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RestaurantStore {
  restaurantId: string;
  restaurantName?: string;

  setRestaurantId: (id: string) => void;
  setRestaurant: (id: string, name: string) => void;
}

export const useRestaurantStore = create<RestaurantStore>()(
  persist(
    (set) => ({
      restaurantId: "",
      restaurantName: undefined,

      setRestaurantId: (id) => set({ restaurantId: id }),
      setRestaurant: (id, name) =>
        set({ restaurantId: id, restaurantName: name }),
    }),
    {
      name: "active-restaurant", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
