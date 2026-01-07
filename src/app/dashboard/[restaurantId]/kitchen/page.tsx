"use client";

import React from "react";
import OrderCard from "./_components/OrderCard";
import { useOrders } from "@/hooks/order/useOrders";
import { CookingPot } from "lucide-react";

const KitchenPage = () => {
  const { data: orders = [] } = useOrders();
  console.log("orders", orders);

  return (
    <div className="p-6 flex flex-wrap gap-4">
      <h3 className=" bg-white px-4 py-2 flex space-x-4 text-xl">
        <CookingPot />
        <span className="font-semibold">Kitchen Department</span>
      </h3>
      <OrderCard orderData={orders} />
    </div>
  );
};

export default KitchenPage;
