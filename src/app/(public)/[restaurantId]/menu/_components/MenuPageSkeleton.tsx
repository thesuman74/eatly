import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MenuPageSkeleton() {
  return (
    <div className="w-full bg-[#f8f8f8] min-h-screen pb-10">
      {/* 1. Header/Banner Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* 2. Profile Info Section */}
        <div className="relative flex flex-col items-start -mt-12 mb-6">
          {/* Logo Avatar */}
          <Skeleton className="h-24 w-24 rounded-2xl border-4 border-white shadow-md bg-white mb-4" />

          <div className="w-full flex justify-between items-center">
            <div className="space-y-2">
              {/* Restaurant Name: Eatlyss */}
              <Skeleton className="h-8 w-44" />
              {/* Social/Info Icons */}
              <div className="flex gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>

            {/* Right side social icons (Globe, Insta, WA) */}
            <div className="flex gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>

          {/* Location Placeholder */}
          <Skeleton className="h-6 w-full max-w-md mt-4 rounded-md" />
        </div>

        {/* 3. Search and Layout Utilities */}
        <div className="flex justify-between items-center gap-4 mb-10">
          {/* Search Bar */}
          <Skeleton className="h-11 w-full max-w-sm rounded-xl" />

          {/* View Toggle & Share Icons */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>

        {/* 4. Category Title */}
        <Skeleton className="h-9 w-36 mb-6 rounded-md" />

        {/* 5. Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-3 rounded-2xl shadow-sm flex gap-4 items-center border border-transparent"
            >
              {/* Product Image */}
              <Skeleton className="h-24 w-24 rounded-xl flex-shrink-0" />

              {/* Product Details */}
              <div className="flex-1 space-y-2">
                {/* Title */}
                <Skeleton className="h-5 w-3/4" />
                {/* Description */}
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
                {/* Price */}
                <Skeleton className="h-5 w-12 mt-2" />
              </div>

              {/* Add Button (+) */}
              <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
