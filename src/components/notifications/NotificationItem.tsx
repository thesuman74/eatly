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
        ? "bg-blue-100 border-l-4 border-blue-600 hover:bg-blue-200"
        : "bg-gray-50 hover:bg-gray-100"
    }
  `}
    >
      <div className="flex-1">
        <div
          className={`text-sm ${
            isUnread
              ? "font-semibold text-gray-900"
              : "font-normal text-gray-700"
          }`}
        >
          {notification.title}
        </div>

        <div className="text-xs text-gray-600 mt-1 leading-snug">
          {notification.message}
        </div>
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
        bg-white border border-blue-300
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
