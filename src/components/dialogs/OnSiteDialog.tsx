import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
import useCartStore from "@/stores/user/userCartStore";
import { useEffect, useState } from "react";
import { ORDER_TYPES, OrderType } from "@/lib/types/order-types";
import { userOrderPayload } from "@/utils/userOrderPayload";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";

export type userOrderPayload = {
  restaurant_id: string;
  order_type: "ONSITE" | "TAKEAWAY" | "DELIVERY";
  customer?: {
    name?: string;
    phone?: string;
    address?: string;
  };
  notes?: string;
  items: {
    product_id: string;
    quantity: number;
  }[];
  payment?: {
    method: string; // cash, card, etc
  };
};

export function OnsiteDialog({ order_type }: { order_type: OrderType }) {
  const {
    cartItems,
    total,
    customer,
    payment,
    clearCart,
    setCustomer,
    setPayment,
  } = useCartStore();

  const { setOrderType } = useCartStore();
  const router = useRouter();

  const restaurantId = useCartStore((state) => state.restaurant_id);

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      return toast.error("Your cart is empty");
    }

    if (!payment?.method) {
      return toast.error("Please select a payment method");
    }

    try {
      // 3️⃣ Build payload from Zustand (single source of truth)
      const payload = userOrderPayload("web");

      console.log("payload", payload);

      // 4️⃣ Basic client-side guard (cheap, useful)
      if (!payload.restaurant_id || payload.items.length === 0) {
        throw new Error("Invalid order data");
      }

      // 5️⃣ Call create-order API
      const res = await fetch("/api/orders/public-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Order creation failed");
      }

      const data = await res.json();

      // 6️⃣ Success handling
      toast.success("Order created successfully");
      console.log("Order created:", data);

      // Optional:
      clearCart();
      // redirect to success page
      router.push(`/tracking/${data.order_id}`);
    } catch (error) {
      console.error("Place order error:", error);
      // show toast / UI feedback
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="cursor-pointer hover:scale-105 duration-300"
        onClick={() => setOrderType(order_type)}
      >
        <button className="mx-2 min-w-[150px] flex-1 rounded-sm bg-blue-500 py-2 text-white">
          <span>🛄</span>
          <span>{order_type}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-[600px] h-[80vh] items-start flex flex-col">
        <DialogHeader>
          <DialogTitle>🛄 On Site</DialogTitle>
          <DialogDescription>
            Please fill the necessary details for On Site
          </DialogDescription>
        </DialogHeader>

        {/* Bill summary */}
        <div className="border border-input rounded-md px-3 py-2 space-y-2 w-full">
          <span className="font-bold text-md">Bill summary</span>

          <div className="space-y-1 text-sm text-gray-700">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>Rs {item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t pt-2 mt-2 font-semibold">
            <span>Total</span>
            <span>Rs {total}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="w-full mt-4">
          <Label className="text-sm text-gray-600">Payment method</Label>
          <Select
            value={payment?.method || ""}
            onValueChange={(val) => setPayment({ ...payment, method: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a payment method" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="paypal">Paypal</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Optional customer info */}
        <div className="w-full space-y-2">
          <Label className="text-sm text-gray-600">
            Customer details (optional — helps quicker confirmation)
          </Label>

          <Input
            placeholder="Customer name (optional)"
            type="text"
            value={customer?.name || ""}
            onChange={(e) =>
              setCustomer({
                ...customer,
                name: e.target.value || undefined,
              })
            }
          />
          <Input
            placeholder="Phone number (optional)"
            type="tel"
            value={customer?.phone || ""}
            onChange={(e) =>
              setCustomer({
                ...customer,
                phone: e.target.value || undefined,
              })
            }
          />
        </div>

        <DialogFooter className="w-full mt-auto">
          <Button onClick={handlePlaceOrder} className="w-full">
            To order (Rs {total})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
