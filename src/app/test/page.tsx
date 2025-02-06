import ItemCard from "@/components/cards/ItemCard";
import TopSection from "@/components/menu/TopSection";
import React from "react";

const page = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <TopSection />

      <ItemCard
        data={{
          title: "Green Tea",
          description: "Green tea description",
          price: "$ 40",
          image: "https://picsum.photos/900",
        }}
      />
    </div>
  );
};

export default page;
