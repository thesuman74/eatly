// src/hooks/order/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/stores/admin/useCartStore";
import {
  CreateOrderPayload,
  Order,
  ORDER_STATUS,
  OrderStatus,
} from "@/lib/types/order-types";
import {
  addOrderAPI,
  deleteOrderItemAPI,
  getOrderDetailsAPI,
  getOrderListAPI,
  updateOrderItemAPI,
  updateOrderStatusAPI,
} from "@/services/orderServices";
import { toast } from "react-toastify";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const cart = useCartStore();

  const restauratId = useRestaurantStore((state) => state.restaurantId);

  return useMutation({
    // Accept payload as argument
    mutationFn: addOrderAPI,
    onSuccess: () => {
      cart.clearCart();
      toast.success("Order registered successfully");

      queryClient.invalidateQueries({ queryKey: ["orders", restauratId] });
    },
  });
};

export const useOrder = (orderId: string | null, restauratId: string) =>
  useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => getOrderDetailsAPI(orderId, restauratId),
    enabled: !!orderId,
  });

export const useOrders = () => {
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  return useQuery<Order[]>({
    queryKey: ["orders-list", restaurantId],
    queryFn: () => getOrderListAPI(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => {
      if (!restaurantId) {
        throw new Error("No active restaurant selected");
      }

      return updateOrderStatusAPI({
        id,
        status,
        restaurantId,
      });
    },
    onSuccess: (_, { id }) => {
      console.log("Invalidating with:", {
        orderId: id,
        restaurantId,
      });
      toast.success("Order status updated");
      queryClient.invalidateQueries({
        queryKey: ["order-details", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["orders-list", restaurantId],
      });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update order status");
    },
  });
};

export const useUpdateOrderItem = () => {
  const queryClient = useQueryClient();
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  return useMutation({
    mutationFn: updateOrderItemAPI,

    onSuccess: () => {
      toast.success("Order updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["orders-list", restaurantId],
      });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update order");
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  return useMutation<
    any, // return type of API
    Error, // error type
    { id: string; payload: CreateOrderPayload } // mutation input type
  >({
    mutationFn: async ({ id, payload }) => {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update order");
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["orders-list", restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: ["order-details", id],
      });
      toast.success("Order updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update order");
    },
  });
};

export const useDeleteOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId }: { itemId: string }) => deleteOrderItemAPI(itemId),
    onMutate: async ({ itemId }) => {
      await queryClient.cancelQueries({ queryKey: ["order-details"] });

      const previousOrder = queryClient.getQueryData<any>(["order-details"]);

      queryClient.setQueryData(["order-details"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((item: any) => item.id !== itemId),
        };
      });

      return { previousOrder };
    },
    onError: (err, variables, context) => {
      if (context?.previousOrder) {
        toast.error(err?.message || "Failed to remove item");

        queryClient.setQueryData(["order-details"], context.previousOrder);
      }
    },
    onSuccess: () => toast.success("Item removed successfully"),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["order-details"] });
    },
  });
};

interface CancelOrderParams {
  orderId: string;
  cancelled_reason: string;
  cancel_note?: string;
}
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  return useMutation({
    mutationFn: async ({
      orderId,

      cancelled_reason,
      cancel_note,
    }: CancelOrderParams) => {
      if (!orderId) throw new Error("Order id is required");
      const payload = {
        orderId,
        cancelled_reason,
        cancel_note,
        restaurantId,
      };
      console.log("payload", payload);
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel order");
      return data;
    },
    onSuccess: (_, { orderId }) => {
      toast.success("Order cancelled successfully");
      console.log("Invalidating with cancel:", {
        orderId: orderId,
        restaurantId,
      });
      queryClient.invalidateQueries({ queryKey: ["order-details", orderId] });
      queryClient.invalidateQueries({
        queryKey: ["orders-list", restaurantId],
      });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to cancel order");
    },
  });
};
