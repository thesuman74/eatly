"use client";
import { useEffect, useCallback, useState } from "react";

export const useBrowserNotifications = () => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if (typeof window !== "undefined" && "Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.log("Browser notifications not supported");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, [isSupported]);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported || permission !== "granted") {
        console.log("[v0] Cannot show notification - permission:", permission);
        return null;
      }

      try {
        // Browser notifications have native sound
        const notification = new Notification(title, {
          ...options,
          // requireInteraction keeps notification visible until user interacts
          requireInteraction: true,
          // Use a sound (some browsers support this)
          silent: false,
        });

        return notification;
      } catch (error) {
        console.error("[v0] Error showing notification:", error);
        return null;
      }
    },
    [isSupported, permission]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
  };
};
