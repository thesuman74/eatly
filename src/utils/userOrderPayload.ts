import useCartStore from "@/stores/user/userCartStore";

export const userOrderPayload = () => {
  const { cartItems, customer, payment, restaurant_id, order_type } =
    useCartStore.getState();

  return {
    restaurant_id,

    order_type: order_type,
    customer: {
      name: customer?.name || null,
      phone: customer?.phone || null,
      address: customer?.address || null,
    },
    payment: {
      method: payment?.method || null,
    },
    items: cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    })),
  };
};
