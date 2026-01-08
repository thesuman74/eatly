// Define roles as a constant object
export const STAFFROLES = {
  OWNER: "owner",
  STAFF: "staff",
  KITCHEN: "kitchen",
  CUSTOMER: "customer",
} as const;

// Type derived from the values of USERROLES
export type StaffRole = (typeof STAFFROLES)[keyof typeof STAFFROLES];

export interface StaffTypes {
  // From auth.users
  id?: string; // Auth user ID (UUID)
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string; // Optional user photo

  // From users table
  role: StaffRole;
  restaurant_id?: string; // Nullable: only for users tied to a restaurant
  created_at?: string; // Timestamp
  max_restaurant?: number; // Default 1 for normal users
}
