"use client";

import { useCallback } from "react";
import { toast } from "react-toastify";
import { useNotificationSound } from "./useNotificationSound";
import { useBrowserNotifications } from "./useBrowserNotification";

interface NotificationOptions {
  title: string;
  message: string;
  icon?: string;
  onClick?: () => void;
}

export const useEnhancedNotifications = () => {
  const { play: playSound, stop: stopSound } = useNotificationSound();

  const {
    isSupported: isBrowserNotificationSupported,
    permission,
    requestPermission,
    showNotification: showBrowserNotification,
  } = useBrowserNotifications();

  const notify = useCallback(
    ({ title, message, icon, onClick }: NotificationOptions) => {
      const isPageVisible = document.visibilityState === "visible";
      const hasBrowserPermission = permission === "granted";

      // 1️⃣ Prefer browser notification when tab is hidden
      if (!isPageVisible && hasBrowserPermission) {
        const notification = showBrowserNotification(title, {
          body: message,
          icon: icon || "/icon-light-32x32.png",
          tag: `notification-${Date.now()}`,
          requireInteraction: true,
        });

        if (notification) {
          notification.onclick = () => {
            window.focus();
            onClick?.();
            notification.close();
          };
          return;
        }
      }

      // 2️⃣ Toast notification (foreground or fallback)
      const soundPlayed = playSound();

      const toastId = toast(
        ({ closeToast }) => (
          <div className="flex flex-col gap-2">
            <strong>{title}</strong>
            <span className="text-sm">{message}</span>

            <button
              className="mt-2 text-sm font-medium text-blue-600"
              onClick={() => {
                onClick?.();
                stopSound();
                closeToast();
              }}
            >
              Dismiss
            </button>
          </div>
        ),
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          onClose: () => {
            stopSound();
          },
        }
      );

      // 3️⃣ Fallback hint
      if (!soundPlayed && !hasBrowserPermission) {
        console.log(
          "Consider requesting browser notification permission for better experience"
        );
      }

      return toastId;
    },
    [permission, playSound, stopSound, showBrowserNotification]
  );

  return {
    notify,
    requestPermission,
    stopSound,
    hasNotificationPermission: permission === "granted",
    canRequestPermission: permission === "default",
    isBrowserNotificationSupported,
  };
};
