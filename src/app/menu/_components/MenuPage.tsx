"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { QrCode, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import TopSection from "@/components/menu/TopSection";
import ListCard from "@/components/cards/ListCard";
import Link from "next/link";
import BouncingText from "@/components/animation/BouncingText";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategoriesAPI } from "@/services/categoryServices";
import { MenuItemTypes } from "../../../../types/menu";
import { ProductCategoryTypes, ProductTypes } from "@/lib/types/menu-types";

// const menuItems = {
//   "Tea Specials": [
//     {
//       id: "1",
//       title: "Masala Tea",
//       description:
//         "Masala Chai is an Indian beverage made by brewing black tea with fragrant spices and herbs.",
//       price: "  500",
//       image: "/Images/coffee.png",
//     },
//     {
//       id: "2",
//       title: "Green Tea",
//       description:
//         "Green tea contains antioxidants and other compounds that may help with overall health.",
//       price: "  400",
//       image: "/Images/coffee.png",
//     },
//     {
//       id: "3",
//       title: "Lemon Tea",
//       description:
//         "Lemon tea is a refreshing tea where lemon juice is added in black or green tea.",
//       price: "  450",
//       image: "/Images/coffee.png",
//     },
//   ],
//   Coffee: [
//     {
//       id: "1",
//       title: "Cappuccino",
//       description:
//         "Espresso with steamed milk foam, perfect balance of coffee and milk.",
//       price: "  600",
//       image: "/Images/coffee.png",
//     },
//     {
//       id: "2",
//       title: "Latte",
//       description: "Espresso with steamed milk and a light layer of milk foam.",
//       price: "  550",
//       image: "/Images/coffee.png",
//     },
//   ],
//   Breakfast: [
//     {
//       id: "1",
//       title: "English Breakfast",
//       description: "Eggs, bacon, toast, and beans served with tea or coffee.",
//       price: "  1200",
//       image: "/Images/coffee.png",
//     },
//     {
//       id: "2",

//       title: "Continental",
//       description:
//         "Croissant, jam, butter, and fresh fruits with your choice of beverage.",
//       price: "  1000",
//       image: "/Images/coffee.png",
//     },
//   ],
// };

interface MenuPageProps {
  initialCategories: ProductCategoryTypes[];
}

export default function MenuPage({ initialCategories }: MenuPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [fullUrl, setFullUrl] = useState<string>("");
  const [cartItems, setCartItems] = useState<ProductTypes[]>([]);
  const [total, setTotal] = useState(0);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAPI,
    initialData: initialCategories,
  });

  const handleAddToCart = (items: ProductTypes) => {
    setCartItems((preItems) => {
      const updatedCart = [...preItems, items];

      const total = updatedCart.reduce((total, item) => {
        const priceNumber = Number(item.price);
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

  //   const filteredCategories = categories.reduce(
  //     (acc: ProductCategoryTypes[], category) => {
  //       // Filter products in this category
  //       const filteredProducts = category.products.filter(
  //         (product) =>
  //           product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //           product.description.toLowerCase().includes(searchQuery.toLowerCase())
  //       );

  //       if (filteredProducts.length > 0) {
  //         acc.push({
  //           ...category,
  //           products: filteredProducts,
  //         });
  //       }

  //       return acc;
  //     },
  //     [] as ProductCategoryTypes[]
  //   );

  return (
    <div className="min-h-screen max-w-7xl mx-auto ">
      {/* Top Section */}
      <TopSection />

      <div className="container mx-auto px-4">
        <div className=" z-40 py-4 space-y-4">
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
          {categories.map((category) => (
            <div key={category.id} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
              <div
                //  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 "
                className="grid grid-cols-1 md:grid-cols-2  gap-8"
              >
                {category.products.map((item) => (
                  <ListCard
                    key={item.id}
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
            <section className="fixed bottom-0 right-0 flex w-full items-center justify-around bg-secondary px-20 py-4 shadow-lg">
              <div className="flex w-full flex-col">
                <span> {cartItems?.length} Products</span>{" "}
                <BouncingText
                  text={total.toString()}
                  className="text-xl font-bold"
                />
                {/* <span className="text-xl font-bold">{total}</span> */}
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
