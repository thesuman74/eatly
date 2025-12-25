export async function getPublicOrderInfo(orderId: string) {
  const res = await fetch(`/api/orders/tracking?orderId=${orderId}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data?.message || "Failed to fetch order info");
  return data;
}
