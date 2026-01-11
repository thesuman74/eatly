"use client";

import { Check } from "lucide-react";
import { Notification } from "@/lib/types/notifications-types";

export default function NotificationItem({
  notification,
  onClick,
  onMarkAsRead,
}: {
  notification: Notification;
  onClick: () => void;
  onMarkAsRead: () => void;
}) {
  const isUnread = !notification.is_read;

  return (
    <div
      onClick={onClick}
      className={`
    relative flex items-start gap-3 p-3 border-b cursor-pointer
    transition-colors
    ${
      isUnread
        ? "bg-secondary/90 border-l-4 text-black dark:text-white border-blue-600 hover:bg-blue-200"
        : "bg-secondary hover:bg-gray-100 text-black/40 dark:text-white/60"
    }
  `}
    >
      <div className="flex-1">
        <div
          className={`text-sm ${isUnread ? "font-semibold " : "font-normal "}`}
        >
          {notification.title}
        </div>

        <div className="text-xs  mt-1 leading-snug">{notification.message}</div>
      </div>

      {/* Mark as read button */}
      {isUnread && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkAsRead();
          }}
          className="
        ml-2 rounded-full p-1.5
        text-blue-700
         border border-blue-300
        hover:bg-blue-50
        transition
      "
          title="Mark as read"
        >
          <Check className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
