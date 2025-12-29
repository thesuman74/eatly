import { CancelOrderButton } from "@/app/dashboard/order/_components/cancelOrder/CancelOrderButton";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "@/lib/types/order-types";
import { Loader2, X } from "lucide-react";
import { useState } from "react";

export function PrimaryOrderButton({
  order,
  loading,
  onAccept,
  onFinish,
  onCancel,
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
  onCancel: () => void;
}) {
  const [cancelOpen, setCancelOpen] = useState(false);

  if (order.status === ORDER_STATUS.DRAFT) {
    return (
      <>
        <Button
          variant={"outline"}
          className="text-red-500 border-red-500 w-full"
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
        >
          <span className="cursor-pointer">
            <X />
          </span>
          <span>Reject</span>
        </Button>

        <Button
          className="bg-green-600"
          disabled={loading.accept}
          onClick={(e) => {
            e.stopPropagation();
            onAccept();
          }}
        >
          {loading.accept ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Accept
            </>
          ) : (
            "Accept"
          )}
        </Button>
      </>
    );
  }

  return (
    <Button
      disabled={loading.finish}
      onClick={(e) => {
        e.stopPropagation();
        onFinish();
      }}
    >
      {loading.finish ? (
        <>
          <Loader2 className="animate-spin mr-2" />
          Finish
        </>
      ) : (
        "Finish"
      )}
    </Button>
  );
}
