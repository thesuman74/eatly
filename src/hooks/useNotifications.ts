import {
  fetchNotificationsAPI,
  markNotificationAsReadAPI,
} from "@/services/notificationServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useNotifications = (restaurantId?: string) => {
  return useQuery({
    queryKey: ["notifications", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const data = await fetchNotificationsAPI(restaurantId, 10);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!restaurantId,
    initialData: [],
  });
};

export const useMarkAsRead = (restaurantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsReadAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: ["unread-count", restaurantId],
      });
    },
  });
};

export const useUnreadCount = (restaurantId: string) => {
  return useQuery({
    queryKey: ["unread-count", restaurantId],
    queryFn: async () => {
      const res = await fetch(
        `/api/notifications?restaurantId=${restaurantId}`
      );
      const data = await res.json();
      return data.filter((n: any) => !n.is_read).length;
    },
    enabled: !!restaurantId,
  });
};
