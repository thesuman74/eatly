import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();

export async function getOrdersCount(
  restaurantId: string,
  periodStart: Date,
  periodEnd: Date,
) {
  const { count, error } = await supabase
    .from("order_items")
    .select("*", { count: "exact" })
    .eq("restaurant_id", restaurantId)
    .gte("created_at", periodStart.toISOString())
    .lte("created_at", periodEnd.toISOString());

  if (error) throw new Error(error.message);

  return count || 0;
}
