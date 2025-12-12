// src/hooks/order/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/app/stores/useCartStore";
import {
  CreateOrderPayload,
  Order,
  OrderStatus,
} from "@/lib/types/order-types";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const cart = useCartStore();

  return useMutation({
    // Accept payload as argument
    mutationFn: async (payload: CreateOrderPayload) => {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Throw the error so React Query can catch it
        throw new Error(data?.error || "Failed to create order");
      }

      return data;
    },
    onSuccess: () => {
      cart.clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useOrder = (id: string) =>
  useQuery<Order>({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error("Order not found");
      return res.json();
    },
  });

export const useOrders = (status?: OrderStatus) =>
  useQuery<Order[]>({
    queryKey: ["orders", status],
    queryFn: async () => {
      const url = status ? `/api/orders?status=${status}` : "/api/orders";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update order status");
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
