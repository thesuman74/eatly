// card that change to list view to card view when resize
import React from "react";

interface ItemCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
}
const ItemCard = ({ data }: { data: ItemCardProps }) => {
  return (
    <section className="rouded-lg  my-2  gap-2 bg-white shadow-2xl  w-full max-w-[200px] rounded-xl hover:scale-110 transition-all duration-200">
      <div className="w-full h-28 sm:h-32 overflow-hidden rounded-xl p-1 ">
        <img
          src={`${data.image}`}
          alt=""
          className="h-full w-full rounded-xl object-cover"
        />
      </div>
      <div className=" w-full flex-col px-2 py-1">
        <span className="font-bold">{data.title}</span>
        <p className="text-gray-600 text-xs line-clamp-2">{data.description}</p>
        <div className="flex justify-between mt-2">
          <span>$ {data.price}</span>
          <span className="px-4 bg-blue-500 text-white rounded-sm text-xl text-center items-center">
            +
          </span>
        </div>
      </div>
    </section>
  );
};

export default ItemCard;
