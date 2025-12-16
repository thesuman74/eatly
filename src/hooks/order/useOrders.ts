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

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const cart = useCartStore();

  return useMutation({
    // Accept payload as argument
    mutationFn: addOrderAPI,
    onSuccess: () => {
      cart.clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useOrder = (orderId: string | null) =>
  useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => getOrderDetailsAPI(orderId),
    enabled: !!orderId,
  });

export const useOrders = (status?: OrderStatus) =>
  useQuery<Order[]>({
    queryKey: ["orders", status],
    queryFn: () => getOrderListAPI(status),
  });

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatusAPI,
    onSuccess: (_, { id }) => {
      toast.success("Order status updated!");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateOrderItemAPI(itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["order-details"] });

      const previousOrder = queryClient.getQueryData<any>(["order-details"]);

      queryClient.setQueryData(["order-details"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item: any) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        };
      });

      return { previousOrder };
    },
    onError: (err, variables, context) => {
      toast.error(err?.message || "Failed to update quantity");

      if (context?.previousOrder) {
        queryClient.setQueryData(["order-details"], context.previousOrder);
      }
    },
    onSuccess: () => {
      toast.success("Quantity updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["order-details"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any, // return type of API
    Error, // error type
    { id: string; payload: CreateOrderPayload } // mutation input type
  >({
    mutationFn: async ({ id, payload }) => {
      const res = await fetch(`/api/orders/${id}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update order");
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-details", id] });
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
