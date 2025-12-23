import { paymentRefundAPI } from "@/services/paymentServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { on } from "events";
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
    onSuccess: ({ orderId }) => {
      toast.success("Order refunded successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-details", orderId] });
    },
    onError: () => {
      toast.error("Failed to refund order");
    },
  });
};
