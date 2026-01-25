import { Button } from "@/components/ui/button";
import { DollarSign, Loader2 } from "lucide-react";

export function PayButton({
  onPay,
  loading,
}: {
  onPay: () => void;
  loading?: boolean;
}) {
  return (
    <Button
      variant="outline"
      onClick={(e) => {
        e.stopPropagation();
        onPay();
      }}
      className="border-blue-600 text-blue-600 hover:bg-blue-50 h-6 md:h-8 px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm sm:flex hidden"
    >
      <DollarSign size={14} />
      {loading ? <Loader2 className="animate-spin" /> : "Pay"}
    </Button>
  );
}
