"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { Notification } from "@/lib/types/notifications-types";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Bell } from "lucide-react";
import { useNotificationSound } from "./useNotificationSound";

export const useRealtimeNotifications = (
  restaurantId: string,
  onNewNotification?: (notification: Notification) => void
) => {
  const supabase = createBrowserSupabaseClient();

  const { play, stop } = useNotificationSound();

  useEffect(() => {
    if (!restaurantId) return;

    const channel = supabase
      .channel(`notifications:${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;

          // Optional callback for parent component
          if (onNewNotification) onNewNotification(newNotification);

          // Toast notification
          toast.info(`${newNotification.title}: ${newNotification.message}`, {
            autoClose: 5000,
            onClick: () => stop(), // stop sound when user clicks toast
          });

          // Play notification sound
          play();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, onNewNotification]);
};
