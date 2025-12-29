import OrderTracking from "@/app/(public)/tracking/_components/OrderTracking";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const data = await params;

  console.log("orderId data", data);
  return (
    <div>
      this is tracking {data.orderId}
      <OrderTracking orderId={data.orderId} />
    </div>
  );
}
