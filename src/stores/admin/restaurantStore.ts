import { create } from "zustand";

interface RestaurantStore {
  restaurantId: string;
  restaurantName?: string; // optional if you want to store the name too

  setRestaurantId: (id: string) => void;
  setRestaurant: (id: string, name: string) => void; // new method
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurantId: "",
  restaurantName: undefined,

  setRestaurantId: (id) => set({ restaurantId: id }),
  setRestaurant: (id, name) => set({ restaurantId: id, restaurantName: name }),
}));
