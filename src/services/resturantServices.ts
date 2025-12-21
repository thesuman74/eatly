export async function getUserRestaurantsAPI(restaurantId: string) {
  try {
    const res = await fetch(`/api/restaurant?restaurantId=${restaurantId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error(
      "Error fetching restaurant:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error || "Failed to fetch categories"
    );
  }
}
