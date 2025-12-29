import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import {
  fetchNotificationsAPI,
  markNotificationAsReadAPI,
} from "@/services/notificationServices";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const useNotifications = () => {
  const restaurantId = useRestaurantStore((state) => state.restaurantId);
  return useQuery({
    queryKey: ["notifications", restaurantId],
    queryFn: async () => {
      if (!restaurantId) {
        return { notifications: [], unreadCount: 0 };
      }
      return fetchNotificationsAPI(restaurantId, 10);
    },
    enabled: !!restaurantId,
    initialData: { notifications: [], unreadCount: 0 },
  });
};

export const useMarkAsRead = () => {
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsReadAPI(notificationId, restaurantId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", restaurantId],
      });
    },
  });
};
