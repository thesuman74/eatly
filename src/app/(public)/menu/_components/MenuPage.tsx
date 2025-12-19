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
import { ProductCategoryTypes, ProductTypes } from "@/lib/types/menu-types";
import useCartStore from "@/stores/user/userCartStore";
import Top from "@/components/menu/Top";
import {
  getRestaurants,
  getUserRestaurants,
} from "@/services/resturantServices";

interface MenuPageProps {
  initialCategories: ProductCategoryTypes[];
  restaurants: any;
}

export default function MenuPage({
  initialCategories,
  restaurants,
}: MenuPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [fullUrl, setFullUrl] = useState<string>("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAPI,
    initialData: initialCategories,
  });
  const { cartItems, addToCart, total } = useCartStore();

  const handleAddToCart = (items: ProductTypes) => {
    addToCart(items);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.href;
      setFullUrl(pathname);
    }
  }, []);

  const filteredCategories = categories.reduce(
    (acc: ProductCategoryTypes[], category: ProductCategoryTypes) => {
      // Filter products in this category
      const filteredProducts = category.products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredProducts.length > 0) {
        acc.push({
          ...category,
          products: filteredProducts,
        });
      }

      return acc;
    },
    [] as ProductCategoryTypes[]
  );

  return (
    <div className="min-h-screen max-w-7xl mx-auto ">
      {/* Top Section */}
      <Top restaurant={restaurants[0]} />

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
          {filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60  ">
              <h1 className="text-2xl font-bold mb-4">No products found</h1>
            </div>
          ) : (
            <>
              {" "}
              {filteredCategories.map((category: ProductCategoryTypes) => (
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
            </>
          )}
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
