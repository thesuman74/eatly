// src/hooks/order/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/app/stores/useCartStore";
import {
  CreateOrderPayload,
  Order,
  OrderStatus,
} from "@/lib/types/order-types";
import {
  addOrderAPI,
  getOrderDetailsAPI,
  getOrderListAPI,
  updateOrderStatusAPI,
} from "@/services/orderServices";

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
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
