export async function addRestaurantAPI() {
  const response = await fetch("/api/restaurant/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to add category");
  }

  return data.category;
}
