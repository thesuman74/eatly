"use client";

import { NotificationPermissionPrompt } from "@/components/notificationPermissionPrompts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEnhancedNotifications } from "@/hooks/useEnhancedNotification";
import { Bell, Volume2 } from "lucide-react";

export default function Page() {
  const { notify, hasNotificationPermission, requestPermission } =
    useEnhancedNotifications();

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

  const handleOrderNotification = () => {
    notify({
      title: "New Order Received",
      message: "Order #1234 has been placed and requires your attention.",
      icon: "/icon-light-32x32.png",
    });
  };

  const handleMessageNotification = () => {
    notify({
      title: "New Message",
      message: "You have received a new message from a customer.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Enhanced Notifications Demo</h1>
          <p className="text-muted-foreground">
            Test notification sounds that work even when tab is inactive
          </p>
        </div>

        {!hasNotificationPermission && <NotificationPermissionPrompt />}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Browser Notifications</p>
                <p className="text-sm text-muted-foreground">
                  {hasNotificationPermission
                    ? "✅ Enabled - Works in background tabs"
                    : "⚠️ Disabled - Request permission for best experience"}
                </p>
              </div>
              {!hasNotificationPermission && (
                <Button onClick={requestPermission} variant="outline">
                  Enable
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Audio Notifications</p>
                <p className="text-sm text-muted-foreground">
                  ✅ Looping sound until dismissed
                </p>
              </div>
              <Volume2 className="w-5 h-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Notifications</CardTitle>
            <CardDescription>
              Try these notifications. The sound will loop continuously until
              you dismiss it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleTestNotification}
              className="w-full"
              size="lg"
            >
              <Bell className="w-4 h-4 mr-2" />
              Send Test Notification
            </Button>

            <Button
              onClick={handleOrderNotification}
              variant="outline"
              className="w-full bg-transparent"
              size="lg"
            >
              Send "New Order" Notification
            </Button>

            <Button
              onClick={handleMessageNotification}
              variant="outline"
              className="w-full bg-transparent"
              size="lg"
            >
              Send "New Message" Notification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p className="font-medium">To test background notifications:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                <li>
                  Click "Enable" for browser notifications (if not already
                  enabled)
                </li>
                <li>Click any notification button above</li>
                <li>Switch to a different tab immediately</li>
                <li>You should receive a system notification with sound</li>
                <li>
                  Click the notification or return to this tab and click
                  "Dismiss"
                </li>
              </ol>
            </div>

            <div className="space-y-2">
              <p className="font-medium">To test active tab notifications:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                <li>Stay on this tab</li>
                <li>Click any notification button</li>
                <li>A toast notification will appear with looping sound</li>
                <li>Click "Dismiss" to stop the sound</li>
              </ol>
            </div>

            <div className="p-4 bg-muted rounded-lg mt-4">
              <p className="font-medium mb-2">Key Features:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Sound loops continuously until dismissed</li>
                <li>
                  Works even when tab is inactive (with browser permission)
                </li>
                <li>Audio auto-unlocks on any user interaction</li>
                <li>Notifications require interaction to dismiss</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
