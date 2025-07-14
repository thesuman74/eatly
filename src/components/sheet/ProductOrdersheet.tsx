"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "../ui/textarea";
import React, { useState } from "react";
import { Calendar, Check, Clock, Hash, Utensils, X } from "lucide-react";
import ProductSheet from "@/app/(dashboard)/order/_components/Products/ProductSheet";
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ProductOrdersheet = ({ open, setOpen }: Props) => {
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        {/* <SheetTrigger asChild>
        <Button variant="outline">+ Product </Button>
      </SheetTrigger> */}
        <SheetTitle>{""}</SheetTitle>
        <SheetContent className="p-0">
          <aside className="h-screen max-w-sm w-full bg-gray-100">
            <div className="flex  px-4 py-2 bg-yellow-500 text-white">
              <div className="flex space-x-2">
                <Hash />
                <span className="text-lg font-semibold">1</span>
              </div>
              <div className="flex space-x-4 items-center px-1">
                <span>
                  <Utensils size={20} />
                </span>
                <span className="px-1">On site</span> <span> | </span>{" "}
                <span>Pending</span>
              </div>
            </div>

            {/* POS and |TIme section */}

            <div className="flex justify-between items-center bg-yellow-50 px-2">
              <div className="flex justify-between  py-2">
                <span className=" font-semibold bg-gray-200 px-4 py-1 mx-1 rounded-full text-xs">
                  POS
                </span>
                <div className=" flex items-center">
                  <span>
                    <Calendar size={16} />
                  </span>
                  <span>13/07/25 12:28</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center space-x-2">
                  <span>
                    <Clock size={16} />
                  </span>
                  <span>01:11 minutes</span>
                </div>
              </div>
            </div>
            <hr className="border-gray-400" />
            <Input
              type="text"
              name="product_title"
              placeholder="Add title"
              className="w-full border"
            />

            <Input
              type="text"
              name="client_name"
              placeholder="Add Client Name"
              className="w-full border text-lg"
            />

            {/* <!-- //Products section  --> */}
            <div className="py-2  ">
              <div className="border-b border-gray-400 bg-blue-500  text-white">
                <span className="text-lg font-semibold  px-4 py-1">
                  Products
                </span>
              </div>
              <div className="min-h-[320px] p-2 bg-white "></div>

              <div
                className="py-4 px-2 border-dashed border-gray-400
            "
              >
                <span className="text-gray-700">Sub total: </span>{" "}
                <span>$1000</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center space-y-2 space-x-2 text-sm text-nowrap px-2">
              <button className="rounded-md bg-green-500  px-4 py-1 text-gray-700">
                + Discount
              </button>
              <button className="rounded-md bg-gray-200 px-3 py-1 text-gray-700">
                + Servicing
              </button>
              <button className="rounded-md bg-gray-200 px-3 py-1 text-gray-700">
                + Packaging
              </button>
            </div>

            <div className="my-2 w-full bg-gray-300 p-1"></div>

            <div>
              <div className="flex justify-between px-2">
                <span className="text-lg font-semibold rounded-full px-4 py-1 mx-1 bg-yellow-400 text-white ">
                  Unpaid
                </span>
                <div className="space-x-2">
                  <span>Total:</span>
                  <span>RS</span>
                  <span className="text-2xl">$1000</span>
                </div>
              </div>
            </div>
            <div className="my-2 w-full bg-gray-300 p-1"></div>

            <div className="space-y-2 px-4"></div>
            <div className="flex justify-center w-full gap-4 px-2">
              <Button
                variant={"outline"}
                className="text-red-500 border-red-500 w-full"
              >
                <span className="cursor-pointer">
                  <X />
                </span>
                <span>Cancel</span>
              </Button>

              <Button
                variant={"outline"}
                className="text-blue-500 border-blue-500 w-full"
              >
                <span className="cursor-pointer">$</span>
                <span>Pay</span>
              </Button>

              <Button
                variant={"default"}
                className="text-white bg-green-500 w-full"
              >
                <span className="cursor-pointer">
                  <Check />
                </span>
                <span>Confirm</span>
              </Button>
            </div>
          </aside>

          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProductOrdersheet;
