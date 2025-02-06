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

const menuItems = {
  "Tea Specials": [
    {
      title: "Masala Tea",
      description:
        "Masala Chai is an Indian beverage made by brewing black tea with fragrant spices and herbs.",
      price: "Rs 5,00",
      image: "https://picsum.photos/200/200?1",
    },
    {
      title: "Green Tea",
      description:
        "Green tea contains antioxidants and other compounds that may help with overall health.",
      price: "Rs 4,00",
      image: "https://picsum.photos/200/200?2",
    },
    {
      title: "Lemon Tea",
      description:
        "Lemon tea is a refreshing tea where lemon juice is added in black or green tea.",
      price: "Rs 4,50",
      image: "https://picsum.photos/200/200?3",
    },
  ],
  Coffee: [
    {
      title: "Cappuccino",
      description:
        "Espresso with steamed milk foam, perfect balance of coffee and milk.",
      price: "Rs 6,00",
      image: "https://picsum.photos/200/200?4",
    },
    {
      title: "Latte",
      description: "Espresso with steamed milk and a light layer of milk foam.",
      price: "Rs 5,50",
      image: "https://picsum.photos/200/200?5",
    },
  ],
  Breakfast: [
    {
      title: "English Breakfast",
      description: "Eggs, bacon, toast, and beans served with tea or coffee.",
      price: "Rs 12,00",
      image: "https://picsum.photos/200/200?6",
    },
    {
      title: "Continental",
      description:
        "Croissant, jam, butter, and fresh fruits with your choice of beverage.",
      price: "Rs 10,00",
      image: "https://picsum.photos/200/200?7",
    },
  ],
};

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const [activeCategory, setActiveCategory] = useState("Tea Specials");
  const [fullUrl, setFullUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.href;
      console.log("windlow location", pathname);
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
    <div className="min-h-screen max-w-7xl mx-auto   bg-gray-50">
      <MainNav />

      <div className="container mx-auto pt-28 px-4">
        <div className="sticky top-16 bg-gray-50 z-40 py-4 space-y-4">
          <div className="flex   items-center justify-between gap-4 ">
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
                    <QRCodeSVG value={fullUrl} size={200} />{" "}
                    {/* Updated QRCode component */}
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

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setViewType(viewType === "grid" ? "list" : "grid")
                }
              >
                {viewType === "grid" ? (
                  <List className="h-4 w-4" />
                ) : (
                  <Grid2X2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="w-full justify-start overflow-auto">
              {Object.keys(filteredItems).map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs> */}
        </div>

        <div className="py-8 container">
          {Object.entries(filteredItems).map(([category, items]) => (
            <div
              key={category}
              id={category.toLowerCase()}
              className="mb-8 text-black"
            >
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              <div
                className={`grid gap-4 ${
                  viewType === "grid"
                    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                    : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                {items.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-lg overflow-hidden shadow-sm ${
                      viewType === "list" ? "flex flex-wrap" : ""
                    }`}
                  >
                    <div
                      className={
                        viewType === "list" ? "w-36 p-2  h-full" : "w-full h-48"
                      }
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-semibold text-black">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold">{item.price}</span>
                        <Button size="sm">Add</Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
