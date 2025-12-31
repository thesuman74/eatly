"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useNotifications } from "@/hooks/useNotifications";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { useEnhancedNotifications } from "@/hooks/useEnhancedNotification";
import NotificationList from "./NotificationList";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  const { data, refetch } = useNotifications();
  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  // Unified notify function
  const { notify, stopSound } = useEnhancedNotifications();

  // ❌ Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔔 Bell click
  const handleBellClick = () => {
    setOpen((v) => !v);
    stopSound();
  };
  // 🔴 Realtime subscription
  useRealtimeNotifications(restaurantId, {
    onNewNotification: (notification) => {
      refetch();

      // play(); // play sound for new notification
      notify({
        title: notification.title || "test",
        message: notification.message || "test",
        onClick: () => {
          console.log("Notification clicked!");
        },
      });
    },
  });

  const handleTestNotification = () => {
    notify({
      title: "Test Notification",
      message:
        "This is a test notification with looping sound. Click dismiss to stop the sound.",
      onClick: () => {
        console.log("Notification clicked!");
      },
    });
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        onClick={handleBellClick}
        variant="ghost"
        size="icon"
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute  -top-1 -right-1 text-xs animate-bounce bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-popover border border-border rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 border-b border-border font-semibold">
            Notifications
          </div>
          <Button onClick={handleTestNotification} className="w-full" size="lg">
            <Bell className="w-4 h-4 mr-2" />
            Send Test Notification
          </Button>
          <div className="max-h-96 min-h-60 overflow-y-auto">
            <NotificationList notifications={notifications} />
          </div>
        </div>
      )}
    </div>
  );
}
