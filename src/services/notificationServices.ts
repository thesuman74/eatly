export async function fetchNotificationsAPI(
  restaurantId: string,
  limit?: number
) {
  const res = await fetch(
    `/api/notifications?restaurantId=${restaurantId}&limit=${limit}`
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch notifications");
  return data || [];
}

export async function markNotificationAsReadAPI(notificationId: string) {
  const res = await fetch(`api/notifications`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notificationId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to mark notification as read");
  return data;
}
