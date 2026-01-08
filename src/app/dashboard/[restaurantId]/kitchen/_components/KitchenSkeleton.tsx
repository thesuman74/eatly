import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function KitchenPageSkeleton() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 3. Order Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Generate 3 skeleton cards as placeholders */}
        {[1, 2, 3].map((cardIndex) => (
          <div
            key={cardIndex}
            className="border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col space-y-5 bg-white"
          >
            {/* Card Header: Order # and Timer */}
            <div className="flex justify-between items-start">
              {/* Order Number Badge (e.g., #10) */}
              <Skeleton className="h-8 w-16 rounded-lg" />
              {/* Timer (e.g., 11 hr 52 min) */}
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            {/* Customer Info Row */}
            <div className="flex items-center gap-3">
              {/* User Icon */}
              <Skeleton className="h-6 w-6 rounded-full" />
              {/* Customer ID */}
              <Skeleton className="h-5 w-40 rounded-md" />
            </div>

            {/* Order Items List */}
            <div className="space-y-4 flex-1">
              {/* Generate 2 skeleton items per card */}
              {[1, 2].map((itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center justify-between py-2 border-b border-dashed last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {/* Quantity */}
                    <Skeleton className="h-6 w-6 rounded-sm" />
                    {/* Item Name */}
                    <Skeleton className="h-6 w-36 rounded-md" />
                  </div>
                  {/* Checkbox */}
                  <Skeleton className="h-7 w-7 rounded-md" />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* Status Button (e.g., "preparing") */}
              <Skeleton className="h-12 w-full rounded-xl opacity-60" />
              {/* Main Action Button (e.g., "Mark all prepared") */}
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
