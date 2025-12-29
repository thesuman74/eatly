import React from "react";
import OrderTracking from "../../tracking/_components/OrderTracking";

export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <div>
      <OrderTracking orderId={orderId} />
    </div>
  );
}
