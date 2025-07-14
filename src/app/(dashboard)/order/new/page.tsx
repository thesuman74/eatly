import React from "react";
import ProductOrdersheet from "@/components/sheet/ProductOrdersheet";
import ProductsList from "../_components/Products/ProductsList";

const page = () => {
  return (
    <div className="flex">
      <ProductsList />
      <ProductOrdersheet open={false} />
    </div>
  );
};

export default page;
