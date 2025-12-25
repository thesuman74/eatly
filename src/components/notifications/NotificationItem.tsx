"use client";

import { Notification } from "@/lib/types/notifications-types";

export default function NotificationItem({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-3 border-b cursor-pointer ${
        notification.is_read ? "opacity-60" : "font-medium"
      }`}
    >
      <div>{notification.title}</div>
      <div className="text-sm text-muted-foreground">
        {notification.message}
      </div>
    </div>
  );
}
