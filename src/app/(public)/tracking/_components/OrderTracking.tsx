"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Package,
  RefreshCcw,
  CreditCard,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPublicOrderInfo } from "@/services/publicServices";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

const ORDER_STATUSES = ["draft", "preparing", "ready", "delivered"] as const;

function getStatusIndex(status?: string) {
  return Math.max(0, ORDER_STATUSES.indexOf(status as any));
}

export default function OrderTracking({ orderId }: { orderId: string }) {
  const [cooldown, setCooldown] = useState(0);

  const {
    data: orderInfo,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["public-order", orderId],
    queryFn: () => getPublicOrderInfo(orderId),

    staleTime: 1000 * 60, // 1 minute
  });

  const order = orderInfo?.orderData?.[0];
  const items = orderInfo?.orderItems ?? [];
  const payment = orderInfo?.paymentData?.[0];

  const statusIndex = useMemo(
    () => getStatusIndex(order?.status),
    [order?.status]
  );
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleCheckStatus = async () => {
    if (cooldown > 0) {
      toast.info(`Please wait ${cooldown}s before checking again`);
      return;
    }
    // console.log("order", orderInfo);

    // Trigger manual refetch
    await refetch();

    // Start 30-second cooldown for the button
    setCooldown(30);
  };

  if (isLoading) return <div className="text-center mt-20">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto mt-20 space-y-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex flex-col items-center gap-2">
            <Package className="h-10 w-10" />
            <span>Order Tracking</span>
          </CardTitle>
          <Badge variant={"outline"} className="w-fit">
            {"Customer Name: " + order?.customer_name || "John Doe"}
          </Badge>
          {/* <span className="block">{order?.status}</span> */}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Progress */}
          <div className="flex items-center mx-auto max-w-2xl mt-5">
            {ORDER_STATUSES.map((status, i) => (
              <div key={status} className="flex flex-1 items-center">
                <div className="flex flex-col items-center text-xs">
                  {i <= statusIndex ? (
                    <CheckCircle className="text-green-600" />
                  ) : (
                    <Clock className="text-muted-foreground" />
                  )}
                  <span className="mt-1 capitalize text-center">{status}</span>
                </div>

                {i < ORDER_STATUSES.length - 1 && (
                  <div
                    className={`flex-1 border-t border-dashed border-2 ${
                      i <= statusIndex - 1
                        ? "border-green-600"
                        : "border-muted-foreground"
                    }  mx-2`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Payment Status */}
          <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Payment status</span>
            </div>
            <span
              className={
                payment?.payment_status === "paid"
                  ? "text-green-600 font-medium"
                  : "text-orange-500 font-medium"
              }
            >
              {payment?.payment_status ?? "unpaid"}
            </span>
          </div>

          {/* Items */}
          <div className="border-t pt-3 space-y-2">
            <h4 className="font-medium">Ordered items</h4>
            {items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product?.name} × {item.quantity}
                </span>
                <span>Rs. {item.total_price}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <Button
            className="w-full"
            onClick={handleCheckStatus}
            disabled={cooldown > 0 || isLoading}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {isLoading
              ? "Checking…"
              : cooldown > 0
              ? `Check again in ${cooldown}s`
              : "Check status"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
