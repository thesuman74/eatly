"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  pageIndex,
  pageSize,
  pageCount,
  setPageIndex,
  setPageSize,
}) => {
  const visiblePages = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <div className="flex items-center justify-between p-2">
      {/* Pagination buttons */}
      <Pagination>
        <PaginationContent className="flex items-center gap-1">
          <PaginationPrevious onClick={() => setPageIndex(pageIndex - 1)}>
            Prev
          </PaginationPrevious>

          {visiblePages.map((i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={i === pageIndex}
                onClick={() => setPageIndex(i)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationNext onClick={() => setPageIndex(pageIndex + 1)}>
            Next
          </PaginationNext>
        </PaginationContent>
      </Pagination>

      {/* Rows per page selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm hidden md:flex md:w-28">Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => setPageSize(Number(value))}
        >
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[2, 5, 10, 20, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
