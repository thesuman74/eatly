"use client";

import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";

interface SidePreviewProps {
  src: string;
  showSidePreview?: boolean;
}

const SidePreview = ({ src, showSidePreview = false }: SidePreviewProps) => {
  const [isOpen, setIsOpen] = useState(showSidePreview);
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  if (!isOpen || !restaurantId) return null;

  const targetUrl = `${restaurantId}/${src}`;
  console.log("targetUrl", targetUrl);

  return (
    <div className="z-10  md:w-96 bg-gray-200 flex flex-col shadow-xl">
      {/* Close button */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 rounded-full bg-white p-2 shadow hover:bg-gray-100"
        aria-label="Close preview"
      >
        <X size={18} />
      </button>

      {/* Preview */}
      <div className="flex-1 flex justify-center overflow-hidden">
        <iframe
          src={`/${targetUrl}`}
          // src={`${restaurantId}/menu`}
          className="w-[330px] h-[600px] border rounded-xl mt-12 shadow-lg bg-white"
        />
      </div>

      {/* Bottom action */}
      <div className="p-4 border-t py-6 ">
        <Link
          href={"/" + restaurantId}
          target="_blank"
          className="block w-full text-center rounded-md bg-primary text-white py-2 font-medium hover:opacity-90"
        >
          open in new tab
        </Link>
      </div>
    </div>
  );
};

export default SidePreview;
