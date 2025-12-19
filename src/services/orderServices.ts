import { CreateOrderPayload, OrderStatus } from "@/lib/types/order-types";

export async function addOrderAPI(payload: CreateOrderPayload) {
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
}

export async function getOrderDetailsAPI(orderId: string | null) {
  const res = await fetch(`/api/orders/${orderId}`);

  const data = await res.json(); // ✅ await here

  if (!res.ok) throw new Error(data?.message || "Order not found");

  return data;
}

export async function getOrderListAPI(status?: OrderStatus) {
  const url = status ? `/api/orders?status=${status}` : "/api/orders";
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) throw new Error(data?.message || "Failed to fetch orders");
  return data;
}

export async function updateOrderStatusAPI({
  id,
  status,
  restaurantId,
}: {
  id: string;
  status: OrderStatus;
  restaurantId: string;
}) {
  const res = await fetch(`/api/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, restaurantId }),
  });
  const data = await res.json();

  if (!res.ok)
    throw new Error(data?.message || "Failed to update orders status");
  return data;
}

// lib/api/order-items.ts
export const updateOrderItemAPI = async (itemId: string, quantity: number) => {
  const res = await fetch(`/api/orders/${itemId}/update`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update item");
  return data;
};

export const deleteOrderItemAPI = async (itemId: string) => {
  const res = await fetch(`/api/orders/${itemId}/delete`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete item");
  return data;
};
