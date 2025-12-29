export async function paymentRefundAPI(orderId: string, restaurantId: string) {
  const res = await fetch(`/api/orders/${orderId}/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ restaurantId, orderId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to refund order");
  return data;
}
