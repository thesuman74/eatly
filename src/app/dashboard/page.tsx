import { getUserRestaurants } from "@/services/server/serverRestaurantServices";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const restaurantData = await getUserRestaurants();

  const restaurantId = restaurantData[0]?.id;
  if (!restaurantId) {
    redirect("/dashboard"); // fallback or error page
  }

  redirect(`/dashboard/${restaurantId}/products`);
}
