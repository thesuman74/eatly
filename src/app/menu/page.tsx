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
import TopSection from "@/components/menu/TopSection";
import ListCard from "@/components/cards/ListCard";
import { MenuItemTypes } from "../../../types/menu";
import Link from "next/link";

const menuItems = {
  "Tea Specials": [
    {
      id: "1",
      title: "Masala Tea",
      description:
        "Masala Chai is an Indian beverage made by brewing black tea with fragrant spices and herbs.",
      price: "  500",
      image: "/Images/coffee.png",
    },
    {
      id: "2",
      title: "Green Tea",
      description:
        "Green tea contains antioxidants and other compounds that may help with overall health.",
      price: "  400",
      image: "/Images/coffee.png",
    },
    {
      id: "3",
      title: "Lemon Tea",
      description:
        "Lemon tea is a refreshing tea where lemon juice is added in black or green tea.",
      price: "  450",
      image: "/Images/coffee.png",
    },
  ],
  Coffee: [
    {
      id: "1",
      title: "Cappuccino",
      description:
        "Espresso with steamed milk foam, perfect balance of coffee and milk.",
      price: "  600",
      image: "/Images/coffee.png",
    },
    {
      id: "2",
      title: "Latte",
      description: "Espresso with steamed milk and a light layer of milk foam.",
      price: "  550",
      image: "/Images/coffee.png",
    },
  ],
  Breakfast: [
    {
      id: "1",
      title: "English Breakfast",
      description: "Eggs, bacon, toast, and beans served with tea or coffee.",
      price: "  1200",
      image: "/Images/coffee.png",
    },
    {
      id: "2",

      title: "Continental",
      description:
        "Croissant, jam, butter, and fresh fruits with your choice of beverage.",
      price: "  1000",
      image: "/Images/coffee.png",
    },
  ],
};

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [fullUrl, setFullUrl] = useState<string>("");
  const [cartItems, setCartItems] = useState<MenuItemTypes[]>([]);
  const [total, setTotal] = useState(0);

  const handleAddToCart = (items: MenuItemTypes) => {
    setCartItems((preItems) => {
      const updatedCart = [...preItems, items];

      const total = updatedCart.reduce((total, item) => {
        const priceNumber = Number(item.price.replace(/[^0-9.]/g, ""));
        return total + priceNumber;
      }, 0);

      setTotal(total);

      return updatedCart;
    });
  };

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
                  <ListCard
                    key={item.title}
                    data={item}
                    onAddToCart={() => handleAddToCart(item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* cart section */}
        {cartItems?.length > 0 && (
          <>
            <section className="fixed bottom-0 flex w-full items-center justify-around bg-gray-100 px-8 py-4 shadow-lg">
              <div className="flex w-full flex-col">
                <span> {cartItems?.length} Products</span>{" "}
                <span className="text-xl font-bold"> {total}</span>
              </div>
              <div className="w-full ">
                <Button asChild>
                  <Link
                    href={"/cart"}
                    className="w-full max-w-lg rounded-lg bg-blue-500 py-2 text-white"
                  >
                    See My Order
                  </Link>
                </Button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
