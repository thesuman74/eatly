"use client";

import React from "react";
import OrderCard from "./_components/OrderCard";
import { useOrders } from "@/hooks/order/useOrders";
import { CookingPot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import KitchenPageSkeleton from "./_components/KitchenSkeleton";

const KitchenPage = () => {
  const { data: orders = [], isLoading } = useOrders();
  console.log("orders", orders);

  return (
    <div className="p-6  gap-4">
      <h3 className="  bg-white px-4 py-2 flex space-x-4 text-xl">
        <CookingPot />
        <span className="font-semibold">Kitchen Department</span>
        <span>
          <Badge className="ml-auto border-blue-500" variant={"outline"}>
            {orders.length}
          </Badge>
        </span>
      </h3>
      {isLoading ? <KitchenPageSkeleton /> : <OrderCard orderData={orders} />}
    </div>
  );
};

export default KitchenPage;
