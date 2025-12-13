import CounterTable from "@/components/order/CounterTable";
import OrderTabsSection from "@/components/order/TabsSection";
import TopPart from "@/components/order/TopPart";
import ProductOrdersheet from "@/components/sheet/ProductOrdersheet";
import React from "react";

const page = () => {
  return (
    <div>
      <OrderTabsSection />
      {/* <CounterTable /> */}
      <ProductOrdersheet />
    </div>
  );
};

export default page;
