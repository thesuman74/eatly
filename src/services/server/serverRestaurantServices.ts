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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("restaurant_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!userData?.restaurant_id) {
    return [];
  }

  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return restaurants;
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
