import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "@/lib/types/order-types";
import { Loader2 } from "lucide-react";

export function PrimaryOrderButton({
  order,
  loading,
  onAccept,
  onFinish,
}: {
  order: any;
  loading: {
    accept?: boolean;
    finish?: boolean;
    pay?: boolean;
    status?: boolean;
  };
  onAccept: () => void;
  onFinish: () => void;
}) {
  if (order.status === ORDER_STATUS.DRAFT) {
    return (
      <Button
        className="bg-green-600"
        disabled={loading.accept}
        onClick={(e) => {
          e.stopPropagation();
          onAccept();
        }}
      >
        {loading.accept ? <Loader2 className="animate-spin" /> : "Accept"}
      </Button>
    );
  }

  return (
    <Button
      disabled={loading.finish || loading.pay}
      onClick={(e) => {
        e.stopPropagation();
        onFinish();
      }}
    >
      {loading.finish || loading.pay ? (
        <Loader2 className="animate-spin" />
      ) : (
        "Finish"
      )}
    </Button>
  );
}
