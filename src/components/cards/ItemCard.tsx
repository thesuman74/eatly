import React from "react";

interface ItemCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
}
const ItemCard = ({ data }: { data: ItemCardProps }) => {
  return (
    <section className="rouded-lg w-[200px] gap-2 bg-white shadow-2xl sm:flex sm:w-[400px]">
      <div className="w-full h-32 overflow-hidden rounded-xl p-2 sm:w-[30%]">
        <img
          src="https://picsum.photos/900"
          alt=""
          className="h-full w-full rounded-xl"
        />
      </div>
      <div className="my-auto w-full flex-col p-2 sm:w-[70%]">
        <span className="font-bold">Green Tea</span>
        <p className="text-gray-600 text-sm line-clamp-2">
          Green tea description
        </p>
        <div className="flex justify-between mt-2">
          <span>$ 40</span>
          <span className="px-2 bg-blue-500 text-white rounded-sm items-center">
            Add
          </span>
        </div>
      </div>
    </section>
  );
};

export default ItemCard;
