import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

export function PayButton({ onPay }: { onPay: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={(e) => {
        e.stopPropagation();
        onPay();
      }}
      className="border-blue-600 text-blue-600 hover:bg-blue-50"
    >
      <DollarSign size={14} />
      Pay
    </Button>
  );
}
