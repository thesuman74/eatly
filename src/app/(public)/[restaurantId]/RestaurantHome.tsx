"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import Image from "next/image";
import { Restaurant } from "@/lib/types/resturant-types";

interface RestaurantHomeProps {
  restaurantId: string;
  restaurantDetails: Restaurant;
}
export default function RestaurantHome({
  restaurantId,
  restaurantDetails,
}: RestaurantHomeProps) {
  return (
    <>
      <section className="relative bg-[url('/Images/bg2.png')] text-white bg-cover bg-top bg-no-repeat flex h-screen flex-col  text-white-600">
        <div className="flex h-[80%] w-full pl-8 md:pl-20  p-10">
          <div className="h-full w-full flex flex-col font-bold  justify-around p-4 ">
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeIn",
                type: "spring",
                damping: 5,
              }}
              className="w-fit  text-5xl md:text-7xl font-bold  "
            >
              {restaurantDetails.name}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
              }}
              className="w-fit  border-b text-xl  border-white  "
            >
              {restaurantDetails.description}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
              }}
              className="w-fit "
            >
              Opens at <br></br> 8:00 am - 8:00 pm
            </motion.div>
          </div>
          <div className="h-full w-full items-start flex justify-end p-2">
            <img src="/Images/logo.png" alt="" className="size-28" />
          </div>
        </div>
        <Link
          href={`/menu`}
          // href={`/${restaurantId}/menu`}
          className="flex h-[20%] w-full items-center text-3xl justify-center cursor-pointer "
        >
          <span className="h-fit  border-white border-2 rounded-sm px-4 py-2 hover:scale-110 transition-all duration-200">
            Menus
          </span>
        </Link>
      </section>
    </>
  );
}
