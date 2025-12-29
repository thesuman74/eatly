import useCartStore from "@/stores/user/userCartStore";

export const userOrderPayload = (source: "web" | "mobile" | "pos" = "web") => {
  const {
    cartItems,
    customer,
    payment,
    restaurant_id,
    total,
    order_type,
    guest_id,
  } = useCartStore.getState();

  return {
    restaurant_id,
    order_type: order_type,

    // --- Guest info / customer info ---
    guest_id, // persist guest_id for RLS tracking
    customer: {
      name: customer?.name || null,
      phone: customer?.phone || null,
      address: customer?.address || null,
    },

    // --- Payment info ---
    payment: {
      payment_method: payment?.method || null,
      amount_paid: total || null,
    },

    // --- Order items ---
    items: cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    })),

    // --- Order source ---
    order_source: source, // default 'web', can override if POS or mobile
  };
};
