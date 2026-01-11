import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MenuPageSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto  ">
      {/* 1. Header/Banner Section */}
      <div className="relative h-48 w-full overflow-hidden rounded-b-lg">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="px-6 -mt-10 relative z-10">
        {/* 2. Restaurant Info Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 mb-6">
          <div className="flex items-center gap-4">
            {/* Logo Avatar */}
            <Skeleton className="h-24 w-24 rounded-full border-4 border-white shadow-sm" />
            <div className="space-y-2 mt-8">
              {/* Name: Eatlyss */}
              <Skeleton className="h-8 w-40" />
              {/* Location Placeholder */}
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Top Right Action Icons */}
          <div className="flex gap-3 mb-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const CategoriesSkeleton = () => {
  return (
    <>
      {/* 3. Action Buttons Section */}
      <div className="flex gap-3 mb-8 p-6">
        <Skeleton className="h-10 w-44 rounded-md" /> {/* Add New Category */}
        <Skeleton className="h-10 w-36 rounded-md" /> {/* Scan Menu */}
      </div>

      {/* 4. Category Navigation (Tabs/Chips) */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 ">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* 5. Category List Items */}
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border rounded-xl p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4 w-full">
              {/* Drag Handle */}
              <Skeleton className="h-6 w-4" />

              <div className="space-y-2 flex-1">
                {/* Label: Category Name */}
                <Skeleton className="h-3 w-20" />
                {/* Actual Name (Appetizers/momo) */}
                <Skeleton className="h-5 w-32" />
              </div>

              {/* Right Side Card Actions */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-28 rounded-md" />{" "}
                {/* + Product button */}
                <Skeleton className="h-7 w-7 rounded-full" />{" "}
                {/* Badge counter */}
                <Skeleton className="h-6 w-1" /> {/* Three dots menu */}
                <Skeleton className="h-8 w-8 rounded-md" /> {/* Arrow icon */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
