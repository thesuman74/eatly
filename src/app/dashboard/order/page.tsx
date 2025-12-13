import CounterTable from "@/components/order/CounterTable";
import OrderTabsSection from "@/components/order/TabsSection";
import TopPart from "@/components/order/TopPart";
import ProductOrdersheet from "@/components/sheet/ProductOrdersheet";
import React from "react";
import OrderWorkspace from "./_components/layout/OrderWorkSpace";

const page = () => {
  return (
    <>
      <div>
        <OrderTabsSection />
        {/* <CounterTable /> */}
        <ProductOrdersheet />
      </div>
      <div>
        <OrderWorkspace />
      </div>

     
    </>
  );
};

export default page;
