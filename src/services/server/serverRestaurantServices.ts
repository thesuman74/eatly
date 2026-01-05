import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";
import { UserRoles } from "@/lib/rbac/roles";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Every protected routes should go through this

// 1. Authenticate user
// 2. Resolve role from DB
// 3. Check permission
// 4. Fail fast if unauthorized
// 5. Execute business logic

export async function getAllPublicRestaurants() {
  const supabase = await createClient();

  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("*"); // fetch only needed fields

  if (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }

  return restaurants || [];
}

export async function getUserRestaurants() {
  const supabase = await createClient();

  // 1. Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch role and restaurant assignment
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role, restaurant_id")
    .eq("id", user.id)
    .maybeSingle();

  if (userError || !userData) {
    return [];
  }

  // 3. Permission check (RBAC)
  const isAllowed = can({
    role: userData.role,
    permission: Permission.READ_RESTAURANT_INFO,
  });

  if (!isAllowed) {
    return [];
  }

  // 4. Scope query by role
  let query = supabase.from("restaurants").select("*");

  if (userData.role === UserRoles.OWNER) {
    query = query.eq("owner_id", user.id);
  } else {
    // staff / kitchen / customer → only assigned restaurant
    if (!userData.restaurant_id) {
      return [];
    }
    query = query.eq("id", userData.restaurant_id);
  }

  const { data: restaurants, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return restaurants ?? [];
}
export async function getPublicRestaurantDetails(restaurantId: string) {
  const supabase = await createClient();

  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", restaurantId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!restaurants) throw new Error("Restaurant not found");

  console.log("restaurants from supabase", restaurants);

  return restaurants;
}
