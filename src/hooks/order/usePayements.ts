import { paymentRefundAPI } from "@/services/paymentServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const usePaymentRefund = () => {
  const queryClient = useQueryClient();

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
    onSuccess: ({ restaurantId }) => {
      toast.success("Payment refunded successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders", restaurantId] });
      queryClient.invalidateQueries({
        queryKey: ["order-details", restaurantId],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to refund order");
    },
  });
};
