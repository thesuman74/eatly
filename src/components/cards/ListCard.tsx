"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { MenuItemTypes } from "../../../types/menu";

interface ItemCardProps {
  data: MenuItemTypes;
  onAddToCart?: () => void;
}
const ListCard: React.FC<ItemCardProps> = ({ data, onAddToCart }) => {
  return (
    <>
      <section className="rouded-lg flex flex-grow h-32  my-1 mb-4  gap-0 bg-white   w-full  border-b-2  hover:scale-105 transition-all duration-300">
        {/* image section  */}
        <div className="w-44 h-28 overflow-hidden rounded-xl p-1 ">
          <img
            src={`${data.image}`}
            alt={data.title}
            className="size-28 rounded-xl object-cover"
          />
        </div>
        {/* content section  */}
        <div className=" w-full flex-col px-2 py-1 items-center">
          <span className="font-bold">{data.title}</span>
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
