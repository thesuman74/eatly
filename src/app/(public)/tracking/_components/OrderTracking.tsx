"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Package,
  RefreshCcw,
  CreditCard,
} from "lucide-react";

const MOCK_ITEMS = [
  { id: 1, name: "Chicken Mo:Mo", qty: 2, price: 180 },
  { id: 2, name: "Coke 500ml", qty: 1, price: 60 },
];

const ORDER_STATUSES = ["Order Placed", "Preparing", "Ready for delivery"];

export default function OrderTracking() {
  const [cooldown, setCooldown] = useState(0);
  const [statusIndex, setStatusIndex] = useState(2); // mock: Ready for delivery
  const paymentStatus: "paid" | "unpaid" = "paid"; // mock

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleCheckStatus = () => {
    setCooldown(30);
    // later: refetch order status from API
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 space-y-4 items-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex flex-col items-center gap-2">
            <Package className="h-10 w-10" />
            <span>Order #1</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {ORDER_STATUSES[statusIndex]}
          </p>
        </CardHeader>

        <CardContent className="space-y-6 ">
          {/* Order Progress */}
          <div className="flex items-center mx-auto max-w-2xl">
            {ORDER_STATUSES.map((status, i) => (
              <div key={status} className="flex flex-1 items-center">
                <div className="flex flex-col items-center text-xs">
                  {i <= statusIndex ? (
                    <CheckCircle className="text-green-600" />
                  ) : (
                    <Clock className="text-muted-foreground" />
                  )}
                  <span className="mt-1 text-center">{status}</span>
                </div>

                {i < ORDER_STATUSES.length - 1 && (
                  <div className="flex-1 border-t border-dashed mx-2" />
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
                paymentStatus === "paid"
                  ? "text-green-600 font-medium"
                  : "text-orange-500 font-medium"
              }
            >
              {paymentStatus === "paid" ? "Paid" : "Unpaid"}
            </span>
          </div>

          {/* Items */}
          <div className="border-t pt-3 space-y-2">
            <h4 className="font-medium">Ordered items</h4>
            {MOCK_ITEMS.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>Rs. {item.price * item.qty}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <Button
            className="w-full"
            onClick={handleCheckStatus}
            disabled={cooldown > 0}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {cooldown > 0 ? `Check again in ${cooldown}s` : "Check status"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
