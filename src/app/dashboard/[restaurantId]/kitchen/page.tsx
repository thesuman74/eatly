"use client";

import React from "react";
import OrderCard from "./_components/OrderCard";
import { useOrders } from "@/hooks/order/useOrders";

// Dummy static orders
const orderData = {
  order_number: 2,
  customer_name: "suman",
  created_at: "2026-01-06T12:12:00.000Z",
  items: [
    {
      id: "b2644791-7a10-47c0-a0c4-0b89bb3c7cdf",
      product_id: "6de2e195-a6f3-456a-a0ca-1ec194cd93a9",
      quantity: 1,
    },
  ],
};

const KitchenPage = () => {
  //   const { data: orders = [] } = useOrders();

  return (
    <div className="p-6 flex flex-wrap gap-4">
      <OrderCard />
    </div>
  );
};

export default KitchenPage;
