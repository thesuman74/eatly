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
      <section className="relative h-dvh w-full overflow-hidden">
        {/* Background image */}
        <img
          src={
            restaurantDetails?.banner_url || "https://picsum.photos/1200/300"
          }
          alt={`${restaurantDetails.name} banner`}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />

        {/* Dark faded overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Foreground content */}
        <div className="relative z-10 flex h-[80%] w-full pl-8 md:pl-20 p-10 text-white">
          <div className="h-full w-full flex flex-col font-bold justify-around p-4">
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeIn",
                type: "spring",
                damping: 5,
              }}
              className="w-fit text-5xl md:text-7xl font-bold"
            >
              {restaurantDetails.name}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-fit border-b text-xl border-white"
            >
              {restaurantDetails.description}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-fit"
            >
              Opens at <br /> 8:00 am – 8:00 pm
            </motion.div>
          </div>

          <div className="h-full w-full items-start flex justify-end p-2">
            <Image
              src={restaurantDetails?.logo_url || "/Images/logo.png"}
              alt="Restaurant logo"
              width={100}
              height={100}
              className="size-28 object-cover rounded-full"
            />
          </div>
        </div>

        {/* Bottom action */}
        <Link
          href={`/${restaurantId}/menu`}
          className="relative z-10 flex h-[20%] w-full items-center justify-center text-3xl cursor-pointer text-white"
        >
          <span className="border-white border-2 rounded-sm px-4 py-2 hover:scale-110 transition-all duration-200">
            Menus
          </span>
        </Link>
      </section>
    </>
  );
}
