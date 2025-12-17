"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreateRestaurant() {
  const [restaurantName, setRestaurantName] = useState("My Restaurant");
  const [tagline, setTagline] = useState("Your favorite place");
  const [background, setBackground] = useState("/Images/bg2.png");
  const [logo, setLogo] = useState("/Images/logo.png");
  const [openingHours, setOpeningHours] = useState("8:00 am - 8:00 pm");

  return (
    <section
      className="relative h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Live Preview */}
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
            className="w-fit  text-5xl text-white md:text-7xl font-bold  "
          >
            {restaurantName}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
            }}
            className="w-fit  border-b text-xl text-white  border-white  "
          >
            {tagline}
          </motion.div>
        </div>
        <div className="h-full w-full items-start flex justify-end p-2">
          <img src={logo} alt="" className="size-28" />
        </div>
      </div>
      {/* Center Card */}
      <Card className=" absolute  w-[500px] p-6 bg-white/90 backdrop-blur-md shadow-lg z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create Your Restaurant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Restaurant Name"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Opening Hours"
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Background URL"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Logo URL"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="p-2 border rounded"
          />
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Create</Button>
        </CardFooter>
      </Card>
    </section>
  );
}
