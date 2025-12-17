export interface AddRestaurantPayload {
  restaurantName: string;
  type: string;
}

export const RESTAURANT_TYPES = {
  RESTAURANT: "restaurant",
  BAR: "bar",
  CAFE: "cafe",
  OTHER: "other",
};

export type restaurantType =
  (typeof RESTAURANT_TYPES)[keyof typeof RESTAURANT_TYPES];

export enum UserRole {
  OWNER = "owner",
  STAFF = "staff",
  CUSTOMER = "customer",
}
