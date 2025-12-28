"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEnhancedNotifications } from "@/hooks/useEnhancedNotification";
import { Bell } from "lucide-react";

export function NotificationPermissionPrompt() {
  const {
    hasNotificationPermission,
    canRequestPermission,
    requestPermission,
    isBrowserNotificationSupported,
  } = useEnhancedNotifications();

  // Don't show if already granted or not supported
  if (
    !isBrowserNotificationSupported ||
    hasNotificationPermission ||
    !canRequestPermission
  ) {
    return null;
  }

  const handleRequest = async () => {
    const granted = await requestPermission();
    if (granted) {
      console.log("Notification permission granted");
    }
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Enable Notifications
        </CardTitle>
        <CardDescription>
          Get real-time alerts with sound, even when you're on a different tab
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleRequest}>Enable Notifications</Button>
      </CardContent>
    </Card>
  );
}
