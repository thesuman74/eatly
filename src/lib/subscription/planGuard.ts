// planGuard.ts
import { createClient } from "../supabase/server"; // request-safe

export async function getSubscriptionForRestaurant(restaurantId: string) {
  try {
    const supabase = await createClient(); // create client per request
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*, plan:plans(*)")
      .eq("restaurant_id", restaurantId)
      .single();

    if (error || !data) {
      console.error("Subscription fetch failed:", error, data);
      return null; // return null if subscription not found
    }

    return data;
  } catch (err: any) {
    console.error("getSubscriptionForRestaurant error:", err);
    return null; // return null on unexpected error
  }
}

export async function checkOrderLimit(restaurantId: string, subscription: any) {
  try {
    if (!subscription) {
      console.error("No subscription provided for restaurant:", restaurantId);
      return false; // cannot proceed without subscription
    }

    if (subscription.status !== "active") {
      console.error("Subscription inactive:", subscription);
      return false; // inactive subscription cannot order
    }

    // unlimited plan
    if (subscription.plan.order_limit === null) return true;

    const supabase = await createClient(); // create client per request
    const { count, error } = await supabase
      .from("order_items")
      .select("*", { count: "exact" })
      .eq("restaurant_id", restaurantId)
      .gte("created_at", subscription.period_start)
      .lte("created_at", subscription.period_end);

    if (error) {
      console.error("Error counting orders:", error);
      return false; // assume limit reached on error
    }

    console.log(
      `Restaurant ${restaurantId} has ${count} orders, limit is ${subscription.plan.order_limit}`,
    );

    return (count || 0) < subscription.plan.order_limit;
  } catch (err: any) {
    console.error("checkOrderLimit error:", err);
    return false; // default to false on unexpected errors
  }
}
