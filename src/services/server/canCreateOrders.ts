import { getOrdersCount } from "./getOrderCount";

export async function canCreateOrder(restaurantId: string, subscription: any) {
  if (subscription.status !== "active") {
    throw new Error("Your subscription is inactive. Upgrade to continue.");
  }

  if (subscription.plan.order_limit === null) return true; // unlimited plan

  const ordersThisPeriod = await getOrdersCount(
    restaurantId,
    new Date(subscription.period_start),
    new Date(subscription.period_end),
  );

  if (ordersThisPeriod >= subscription.plan.order_limit) {
    throw new Error("Order limit reached for your plan. Upgrade to continue.");
  }

  return true;
}
