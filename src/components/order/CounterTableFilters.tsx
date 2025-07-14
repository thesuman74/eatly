import { Check, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CounterTableFilters() {
  return (
    <div className="flex justify-between items-center  border-b bg-white mt-8 px-4 ">
      {/* Left - Filter Icon */}
      <div className="flex items-center gap-2 text-gray-500">
        <Filter size={18} />
        <span className="text-sm font-medium">Filter</span>

        {/* Middle - Buttons */}
        <div className="flex  gap-2 py-2 rounded-full">
          <Badge
            variant="outline"
            className="text-sm text-blue-500 font-medium bg-blue-200"
          >
            <Check size={14} />
            All
          </Badge>
          <Badge variant="outline" className="text-sm font-medium">
            Pending
            <Badge
              variant={"default"}
              className="bg-yellow-500 mx-1 text-xs text-white"
            >
              1
            </Badge>
          </Badge>
          <Badge variant="outline" className="text-sm font-medium">
            Ongoing
            <Badge
              variant={"default"}
              className="bg-green-500 mx-1 text-xs text-white"
            >
              1
            </Badge>
          </Badge>
        </div>
      </div>

      {/* Right - Total */}
      <div className="text-sm font-semibold text-gray-700">Total: Rs 52.00</div>
    </div>
  );
}
