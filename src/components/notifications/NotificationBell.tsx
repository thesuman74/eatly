"use client";

import { useUnreadCount } from "@/hooks/useNotifications";
import { useState, useRef, useEffect } from "react";
import NotificationList from "./NotificationList";

export default function NotificationBell({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const { data: count } = useUnreadCount(restaurantId);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded hover:bg-muted"
      >
        🔔
        {count && count > 0 && (
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border rounded shadow-lg z-50">
          <div className="px-4 py-2 border-b font-medium">Notifications</div>

          <div className="max-h-96 min-h-60 overflow-y-auto">
            <NotificationList restaurantId={restaurantId} />
          </div>
        </div>
      )}
    </div>
  );
}
