import { paymentRefundAPI } from "@/services/paymentServices";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const usePaymentRefund = () => {
  const queryClient = useQueryClient();
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  return useMutation({
    mutationFn: ({
      orderId,
      restaurantId,
    }: {
      orderId: string;
      restaurantId: string;
    }) => {
      if (!orderId || !restaurantId) throw new Error("Missing required fields");
      return paymentRefundAPI(orderId, restaurantId);
    },
    onSuccess: ({ orderId }) => {
      toast.success("Payment refunded successfully!");
      queryClient.invalidateQueries({
        queryKey: ["orders-list", restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: ["order-details", orderId],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to refund order");
    },
  });
};
