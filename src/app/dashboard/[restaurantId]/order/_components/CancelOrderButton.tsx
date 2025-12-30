"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_CANCEL_REASONS } from "@/lib/types/order-types";
import { useCancelOrder } from "@/hooks/order/useOrders";
import { toast } from "react-toastify";

interface CancelOrderCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onCancelSuccess?: () => void;
}

export const CancelOrderButton: React.FC<CancelOrderCardProps> = ({
  open,
  onOpenChange,
  orderId,

  onCancelSuccess,
}) => {
  const [reason, setReason] = useState<ORDER_CANCEL_REASONS>();
  const [note, setNote] = useState("");

  const mutation = useCancelOrder();

  const handleConfirm = () => {
    if (!reason) return toast.error("Please select a reason for cancellation");
    if (reason === ORDER_CANCEL_REASONS.OTHER && !note.trim())
      return toast.error("Please provide a note for 'Other'");

    mutation.mutate(
      {
        orderId,
        cancelled_reason: reason,
        cancel_note: note,
      },
      {
        onSuccess: () => {
          onCancelSuccess?.();
          onOpenChange(false);
          setReason(undefined);
          setNote("");
        },
      }
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            Select a reason for cancellation. You can provide a note if
            selecting "Other".
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 mt-2">
          <div>
            <Label>Reason</Label>
            <Select
              value={reason}
              onValueChange={(val) => setReason(val as ORDER_CANCEL_REASONS)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ORDER_CANCEL_REASONS).map((val) => (
                  <SelectItem key={val} value={val}>
                    {val
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reason === ORDER_CANCEL_REASONS.OTHER && (
            <div>
              <Label>Note</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Provide a note"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={mutation.isPending}>
            {mutation.isPending ? "Cancelling..." : "Confirm Cancel"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
