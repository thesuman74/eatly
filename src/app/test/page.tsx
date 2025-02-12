"use client";
import ItemCard from "@/components/cards/ItemCard";
import { OnsiteDialog } from "@/components/dialogs/OnSiteDialog";
import TopSection from "@/components/menu/TopSection";
import React, { useState } from "react";

const page = () => {
  const [items, setItems] = useState<string[]>([]); // Start with an empty array

  const addItem = () => {
    setItems((prevItems) => [...prevItems, "new item"]); // Add new item
  };

  console.log("Current items:", items); // Log updated state

  const cartItems = [
    {
      title: "Green Tea",
      description: "Green tea description",
      price: " Rs 40",
      image: "https://picsum.photos/900",
    },
    {
      title: "Green Tea",
      description: "Green tea description",
      price: " 40",
      image: "https://picsum.photos/900",
    },
  ];

  const total = cartItems.reduce((total, item) => {
    const priceNumber = Number(item.price.replace(/[^0-9.]/g, ""));
    console.log("priceNumber", priceNumber);
    return total + priceNumber;
  }, 0);
  console.log("total", total);

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
      <h2>Items:</h2>
      <button onClick={addItem}>Add Item</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <OnsiteDialog />
    </div>
  );
};

export default page;
