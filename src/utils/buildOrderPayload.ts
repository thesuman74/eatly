import { useCartStore } from "@/app/stores/useCartStore";
import { CreateOrderPayload } from "@/lib/types/order-types";

export const buildOrderPayload = (): CreateOrderPayload => {
  const {
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
      customer_name: customerName,
      order_type: orderType,
      notes: notes || "",
    },
    items: cartItems.map((item) => ({
      product_id: item.product!.id,
      quantity: item.quantity,
      unit_price: item.product!.price,
      total_price: item.total_price,
      notes: item.notes,
    })),
    ...(paymentMethod && amountReceived
      ? {
          payment: {
            method: paymentMethod,
            amount_paid: amountReceived,
            tip: tips || 0,
            change_returned: change >= 0 ? change : 0,
          },
        }
      : {}),
  };
};
