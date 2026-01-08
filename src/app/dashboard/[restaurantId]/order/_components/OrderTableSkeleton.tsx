import { Skeleton } from "@/components/ui/skeleton";
import { OrderRowSkeleton } from "./OrderRowSkeleton";

export function OrderTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="bg-background rounded-md shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-48" />
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, idx) => (
        <OrderRowSkeleton key={idx} />
      ))}
    </div>
  );
}
