"use client";
import { ChevronDown, Plus, Utensils } from "lucide-react";
import { TbPaperBag } from "react-icons/tb";

import { MdOutlineDeliveryDining } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { ProductAddSheet } from "@/components/sheet/productAddSheet";
import ProductOrdersheet from "@/components/sheet/ProductOrdersheet";
import Link from "next/link";

const NewOrderDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleOnDeliveryClick = () => {
    setShowSheet(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex   items-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-white "
      >
        <span>
          <Plus size={16} />
        </span>
        <span className="font-bold">New Orders </span>
        <span
          className={`transform transition-transform ease-in-out duration-500 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDown size={16} />
        </span>{" "}
      </button>

      {showSheet && (
        <ProductOrdersheet open={showSheet} setOpen={setShowSheet} />
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="bg-white rounded-sm p-2  space-y-2  z-10 w-[200px] shadow-2xl  absolute right-0 ">
          <Link
            href={"order/new?type=onsite"}
            className="space-x-2 border-b py-2 border-black/10 flex items-center justify-around cursor-pointer hover:bg-gray-100"
          >
            <div className="space-x-2 flex items-center justify-center">
              <span>
                <Utensils size={16} className="text-gray-500" />
              </span>
              <span>On site</span>
            </div>
            <span className="rounded-full bg-blue-300 p-1 px-2 text-xs text-white ">
              Counter
            </span>
          </Link>

          <Link
            href={"order/new?type=pickup"}
            className="space-x-2 border-b py-2 border-black/10 flex items-center justify-around cursor-pointer hover:bg-gray-100"
          >
            <div className="space-x-2 flex items-center justify-center">
              <span>
                <TbPaperBag size={16} className="text-gray-500" />
              </span>
              <span>Pick Up</span>
            </div>
            <span className="rounded-full bg-blue-300 p-1 px-2 text-xs text-white ">
              Counter
            </span>
          </Link>

          <Link
            href={"order/new?type=delivery"}
            className="space-x-2 border-b py-2 border-black/10 flex items-center px-3 cursor-pointer hover:bg-gray-100"
          >
            <div className="space-x-2 flex items-center justify-center">
              <span>
                <MdOutlineDeliveryDining size={16} className="text-gray-500" />
              </span>
              <span>Delivery </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewOrderDropdown;
