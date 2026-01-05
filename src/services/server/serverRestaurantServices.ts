import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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

  // 1. Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Get user's restaurant assignment
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role, restaurant_id")
    .eq("id", user.id)
    .maybeSingle();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!userData) {
    return [];
  }

  // 3. Query restaurants where user is owner OR staff
  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("*")
    .or(`owner_id.eq.${user.id},id.eq.${userData.restaurant_id || "null"}`);

  if (error) {
    throw new Error(error.message);
  }

  return restaurants || [];
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
