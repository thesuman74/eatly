import { Skeleton } from "@/components/ui/skeleton";

export function OrderRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      {/* Date & Status */}
      <div className="flex flex-col gap-1 w-1/4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>

      {/* Status */}
      <div className="w-1/6">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Total */}
      <div className="w-1/6">
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>

      {/* Client */}
      <div className="w-1/6">
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>

      {/* Actions */}
      <div className="flex gap-2 w-1/6">
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
    </div>
  );
}
