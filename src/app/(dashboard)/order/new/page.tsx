import React from "react";
import ProductOrdersheet from "@/components/sheet/ProductOrdersheet";
import ProductsList from "../_components/Products/ProductsList";
import ProductOrderSideBar from "../_components/Products/ProductOrderSideBar";

const page = () => {
  return (
    <div className="flex">
      <ProductsList />
      <ProductOrdersheet open={false} />
      <ProductOrderSideBar />
    </div>
  );
};

export default page;
