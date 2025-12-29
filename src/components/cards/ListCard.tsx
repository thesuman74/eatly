"use client";
import React from "react";
import { Button } from "../ui/button";
import { MenuItemTypes } from "../../../types/menu";
import Image from "next/image";
import { ProductTypes } from "@/lib/types/menu-types";

interface ItemCardProps {
  data: ProductTypes;
  onAddToCart?: () => void;
}
const ListCard: React.FC<ItemCardProps> = ({ data, onAddToCart }) => {
  // console.log("data in list card", data);
  const imageUrl = data?.images?.[0]?.url || "/Images/coffee.png";
  const imageAlt = data?.images?.[0]?.alt || data.name || "product image";

  return (
    <>
      <section className="rouded-lg flex flex-grow h-32  my-1 mb-4  gap-0 bg-card    w-full  border-b-2  hover:scale-105 transition-all duration-300">
        {/* image section  */}
        <div className="w-40 my-auto h-30 overflow-hidden rounded-xl p-1 ">
          <img
            width={100}
            height={100}
            src={imageUrl}
            alt={imageAlt}
            className="rounded-xl object-cover w-40 h-24"
          />
        </div>
        {/* content section  */}
        <div className=" w-full flex-col px-2 py-1 items-center">
          <span className="font-bold">{data.name}</span>
          <p className="text-gray-600 text-xs line-clamp-2">
            {data.description}
          </p>
          <div className="flex justify-between mt-2">
            <span>$ {data.price}</span>
            <Button
              onClick={onAddToCart}
              className="px-4 bg-blue-500 text-white rounded-sm text-xl text-center items-center"
            >
              +
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListCard;
