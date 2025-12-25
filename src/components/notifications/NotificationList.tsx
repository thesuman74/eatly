"use client";

import { useMarkAsRead, useNotifications } from "@/hooks/useNotifications";
import NotificationItem from "./NotificationItem";

export default function NotificationList({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const { data, isLoading } = useNotifications(restaurantId);
  const { mutate } = useMarkAsRead(restaurantId);
  console.log("data", data);

  if (isLoading) return <div>Loading...</div>;

  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No notifications</div>
    );
  }

  return (
    <div>
      {data &&
        data?.map((n: any) => (
          <NotificationItem
            key={n.id}
            notification={n}
            onClick={() => mutate(n.id)}
          />
        ))}
    </div>
  );
}
