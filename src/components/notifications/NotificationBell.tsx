"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { useState, useRef, useEffect } from "react";
import NotificationList from "./NotificationList";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useNotificationSound } from "@/hooks/useNotificationSound";

export default function NotificationBell({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data, refetch } = useNotifications();

  const notifications = data.notifications;
  const unreadCount = data.unreadCount;

  const { unlockAudio, play, stop } = useNotificationSound();

  const handleBellClick = () => {
    unlockAudio(); // unlock audio after first click
    setOpen((v) => !v);
    stop(); // stop sound when user opens notification list
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Subscribe to realtime notifications
  useRealtimeNotifications(restaurantId, () => {
    // refetch your notifications to update list and badge
    refetch();
  });

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((v) => !v), handleBellClick;
        }}
        className="relative p-2 rounded hover:bg-muted"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border rounded shadow-lg z-50">
          <div className="px-4 py-2 border-b  text-black font-bold">
            Notifications
          </div>

          <div className="max-h-96 min-h-60 overflow-y-auto">
            <NotificationList notifications={notifications} />
          </div>
        </div>
      )}
    </div>
  );
}
