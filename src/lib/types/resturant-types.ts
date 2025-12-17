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

export interface Restaurant {
  id: string; // uuid
  name: string; // text
  slug: string; // text
  owner_id: string; // uuid
  created_at: string; // timestamp with timezone, ISO string
  updated_at: string; // timestamp with timezone, ISO string
  type: restaurantType; // enum type
  logo_url?: string | null; // optional text
  banner_url?: string | null;
  description?: string | null;
}
