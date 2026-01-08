"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { Notification } from "@/lib/types/notifications-types";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Bell } from "lucide-react";
import { useNotificationSound } from "./useNotificationSound";

export const useRealtimeNotifications = (
  restaurantId: string,
  {
    onNewNotification,
  }: {
    onNewNotification?: (notification: Notification) => void;
  }
) => {
  const supabase = createBrowserSupabaseClient();

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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId]);
};
