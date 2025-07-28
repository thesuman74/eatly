"use client";
import React from "react";
import { Button } from "../ui/button";
import { MenuItemTypes } from "../../../types/menu";
import Image from "next/image";

interface ItemCardProps {
  data: MenuItemTypes;
  onAddToCart?: () => void;
}
const ListCard: React.FC<ItemCardProps> = ({ data, onAddToCart }) => {
  return (
    <>
      <section className="rouded-lg flex flex-grow h-32  my-1 mb-4  gap-0 bg-card    w-full  border-b-2  hover:scale-105 transition-all duration-300">
        {/* image section  */}
        <div className="w-40 my-auto h-24 overflow-hidden rounded-xl p-1 ">
          <Image
            width={100}
            height={100}
            src={`${data.image}`}
            alt={data.title}
            className=" rounded-xl object-cover "
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
