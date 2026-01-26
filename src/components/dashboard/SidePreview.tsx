"use client";

import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import { SquareArrowOutUpRight, X } from "lucide-react";
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

  return (
    <div className=" relative  md:w-96 h-full bg-background flex flex-col shadow-xl">
      {/* Close button */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 rounded-full bg-secondary p-2 shadow hover:bg-gray-100"
        aria-label="Close preview"
      >
        <X size={18} />
      </button>

      {/* Preview */}
      <div className="flex-1 flex justify-center overflow-hidden">
        <iframe
          src={`/${targetUrl}`}
          // src={`${restaurantId}/menu`}
          className="w-[300px] h-[550px] border rounded-xl mt-12 shadow-lg bg-background"
        />
      </div>
      {/* Bottom action */}
      <div className="w-full border-t p-4 py-2 flex justify-center">
        <Link
          href={"/" + restaurantId}
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 font-medium text-center hover:opacity-90"
        >
          <SquareArrowOutUpRight />
          <span>Preview</span>
        </Link>
      </div>
    </div>
  );
};

export default SidePreview;
