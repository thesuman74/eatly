"use client";

import { useEffect, useState } from "react";
import { MainNav } from "@/components/main-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Grid2X2, List, QrCode, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import path from "path";
import TopSection from "@/components/menu/TopSection";
import ItemCard from "@/components/cards/ItemCard";
import ListCard from "@/components/cards/ListCard";

const menuItems = {
  "Tea Specials": [
    {
      title: "Masala Tea",
      description:
        "Masala Chai is an Indian beverage made by brewing black tea with fragrant spices and herbs.",
      price: "Rs 5,00",
      image: "/Images/coffee.png",
    },
    {
      title: "Green Tea",
      description:
        "Green tea contains antioxidants and other compounds that may help with overall health.",
      price: "Rs 4,00",
      image: "/Images/coffee.png",
    },
    {
      title: "Lemon Tea",
      description:
        "Lemon tea is a refreshing tea where lemon juice is added in black or green tea.",
      price: "Rs 4,50",
      image: "/Images/coffee.png",
    },
  ],
  Coffee: [
    {
      title: "Cappuccino",
      description:
        "Espresso with steamed milk foam, perfect balance of coffee and milk.",
      price: "Rs 6,00",
      image: "/Images/coffee.png",
    },
    {
      title: "Latte",
      description: "Espresso with steamed milk and a light layer of milk foam.",
      price: "Rs 5,50",
      image: "/Images/coffee.png",
    },
  ],
  Breakfast: [
    {
      title: "English Breakfast",
      description: "Eggs, bacon, toast, and beans served with tea or coffee.",
      price: "Rs 12,00",
      image: "/Images/coffee.png",
    },
    {
      title: "Continental",
      description:
        "Croissant, jam, butter, and fresh fruits with your choice of beverage.",
      price: "Rs 10,00",
      image: "/Images/coffee.png",
    },
  ],
};

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [fullUrl, setFullUrl] = useState<string>("");
  const [cartItems, setCartItems] = useState([]);

  // const handleAddToCart = () => {
  //   setCartItems((prevCart) => {
  //     const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
  //   });
  // };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.href;
      setFullUrl(pathname);
    }
  }, []);

  const filteredItems = Object.entries(menuItems).reduce(
    (
      acc: { [key: string]: (typeof menuItems)[keyof typeof menuItems] },
      [category, items]
    ) => {
      const filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {} as typeof menuItems
  );

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50">
      {/* Top Section */}
      <TopSection />

      <div className="container mx-auto px-4">
        <div className="bg-gray-50 z-40 py-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Input
              type="search"
              placeholder="Search menu.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm text-black"
            />

            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="flex flex-col items-center p-4">
                    <QRCodeSVG value={fullUrl} size={200} />
                    <p className="mt-4 text-sm text-gray-500">
                      Scan to view menu
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Kaji CHiya Menu",
                      url: window.location.href,
                    });
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="py-8 ">
          {Object.entries(filteredItems).map(([category, items]) => (
            <div key={category} id={category.toLowerCase()} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              <div
                //  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 "
                className="grid grid-cols-1 md:grid-cols-2  gap-8"
              >
                {items.map((item) => (
                  <ListCard key={item.title} data={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// <motion.div
//   key={item.title}
//   initial={{ opacity: 0, y: 20 }}
//   animate={{ opacity: 1, y: 0 }}
//   transition={{ delay: index * 0.1 }}
//   className={`bg-white rounded-lg overflow-hidden shadow-sm ${
//     viewType === "list" ? "flex flex-wrap" : ""
//   }`}
// >
//   <div
//     className={
//       viewType === "list" ? "w-36 p-2  h-full" : "w-full h-48"
//     }
//   >
//     <img
//       src={item.image || "/placeholder.svg"}
//       alt={item.title}
//       className="w-full h-full object-cover rounded-lg"
//     />
//   </div>
//   <div className="p-4 flex-1">
//     <h3 className="font-semibold text-black">{item.title}</h3>
//     <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//       {item.description}
//     </p>
//     <div className="flex items-center justify-between mt-2">
//       <span className="font-bold">{item.price}</span>
//       <Button size="sm">Add</Button>
//     </div>
//   </div>
// </motion.div>
