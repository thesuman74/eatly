"use client";

import { Notification } from "@/lib/types/notifications-types";
import { useMarkAsRead } from "@/hooks/useNotifications";
import NotificationItem from "./NotificationItem";

export default function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  const { mutate: markAsRead } = useMarkAsRead();

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={() => {
            // optional: open modal / redirect
            console.log("open notification", notification.id);
          }}
          onMarkAsRead={() => markAsRead(notification.id)}
        />
      ))}
    </div>
  );
}
