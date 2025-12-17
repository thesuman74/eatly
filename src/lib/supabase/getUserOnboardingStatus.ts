// lib/supabase/getUserOnboardingStatus.ts
import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function getUserOnboardingStatus() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!user?.id) {
    redirect("/login");
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("restaurant_id")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user onboarding status:", error.message);
    return { completed: false };
  }

  // Onboarding is complete if restaurant_id exists
  return {
    completed: !!userData?.restaurant_id,
    restaurantId: userData?.restaurant_id,
  };
}
