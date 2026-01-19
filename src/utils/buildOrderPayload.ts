import { useCartStore } from "@/stores/admin/useCartStore";
import { CreateOrderPayload } from "@/lib/types/order-types";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";

export const buildOrderPayload = (reataurantId: string): CreateOrderPayload => {
  const {
    currentlyActiveOrderId,
    cartItems,
    customerName,
    orderType,
    notes,
    paymentMethod,
    amountReceived,
    tips,
  } = useCartStore.getState();

  const subtotal = cartItems.reduce((sum, i) => sum + i.total_price, 0);
  const totalToPay = subtotal + (tips || 0);
  const change = (amountReceived || 0) - totalToPay;

  return {
    order: {
      id: currentlyActiveOrderId || undefined, // <-- include id

      customer_name: customerName,
      order_type: orderType,
      notes: notes || "",
      restaurant_id: reataurantId,
      order_source: "pos",
    },
    items: cartItems.map((item) => ({
      product_id: item.product!.id,
      quantity: item.quantity,
      unit_price: item.product!.price,
      total_price: item.total_price,
      notes: item.notes,
      action: item.action,
    })),
    ...(paymentMethod && amountReceived
      ? {
          payment: {
            method: paymentMethod,
            amount_paid: amountReceived,
            tip: tips || 0,
            change_returned: change >= 0 ? change : 0,
            payment_status: change >= 0 ? "paid" : "unpaid",
          },
        }
      : {}),
  };
};
