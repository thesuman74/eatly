import { createBrowserSupabaseClient } from "../supabase/client";

export async function getUserMenuExtractions() {
  const supabase = createBrowserSupabaseClient();

  // Get currently authenticated user
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    console.error("Error fetching authenticated user:", authError?.message);
    return null;
  }

  const userId = authData.user.id;

  // Fetch user along with their plan's extraction limit
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      menu_extracted,
      plan (
        menu_extraction_limit
      )
    `,
    )
    .eq("id", userId)
    .single();

  if (error || !data || !data.plan) {
    console.error("Error fetching user extraction info:", error?.message);
    return null;
  }
  const plan = Array.isArray(data.plan) ? data.plan[0] : data.plan;

  if (!plan) {
    console.error("No plan found for user");
    return null;
  }

  const used = data.menu_extracted;
  const available = Math.max(plan.menu_extraction_limit - used, 0);
  // const used = data.menu_extracted;
  // const available = data.plan[0]?.menu_extraction_limit - used;

  return {
    used,
    available: available >= 0 ? available : 0, // ensure not negative
  };
}
