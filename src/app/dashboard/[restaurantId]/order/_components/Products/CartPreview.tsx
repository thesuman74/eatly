"use client";
import { useCartStore } from "@/stores/admin/useCartStore";
import { PAYMENT_STATUS } from "@/lib/types/order-types";
import { X } from "lucide-react";

export default function CartPreview() {
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();
  const cartTotal = useCartStore((state) => state.cartTotal());

  const paymentStatus = useCartStore((state) => state.paymentStatus);

  return (
    <>
      <div className="w-full max-w-md  bg-background border rounded shadow-md ">
        <div className="flex items-center justify-between border-b  ">
          <span className="font-bold text-sm md:text-md w-full text-white bg-blue-500 dark:bg-muted p-2">
            + Products
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 min-h-[180px] md:min-h-[240px] max-h-[140px] md:max-h-[250px]">
          {cartItems.map((item) => {
            const itemImage =
              item.product?.images?.find((img) => img.is_primary)?.url ||
              item.product?.images?.[0]?.url ||
              "/Images/coffee.png";

            return (
              <div
                key={item.product?.id}
                className="flex items-center text-sm md:text-md gap-4 mb-4 bg-card border rounded-lg p-1"
              >
                <img
                  src={itemImage}
                  alt={item.product?.name}
                  className="size-10 md:size-16 object-cover rounded-lg"
                />
                <div className="flex flex-1 flex-col ">
                  <div className="flex justify-between w-full items-center">
                    <h4 className="w-full line-clamp-1 font-semibold">
                      {item.product?.name}
                    </h4>
                    <span>${item.product?.price}</span>
                    <button
                      className="text-gray-500 px-2"
                      onClick={() => removeFromCart(item?.product!.id)}
                    >
                      <X />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product!.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product!.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center space-y-2 space-x-2 text-sm text-nowrap px-2 py-2">
        <div></div>
        <button className="rounded-md bg-green-500 px-4 py-1 text-gray-700">
          + Discount
        </button>
        <button className="rounded-md bg-gray-200 px-3 py-1 text-gray-700">
          + Servicing
        </button>
        <button className="rounded-md bg-gray-200 px-3 py-1 text-gray-700">
          + Packaging
        </button>
        <div className="my-2 w-full border-b-2 border-dashed border-gray-300 p-1"></div>

        <div className="flex justify-between w-full items-center px-1">
          <span
            className={`text-lg font-semibold rounded-full px-4 py-1 mx-1  text-white ${
              paymentStatus === PAYMENT_STATUS.PAID
                ? "bg-green-600"
                : "bg-yellow-400"
            }`}
          >
            {paymentStatus?.toUpperCase() || "PENDING"}
          </span>
          <div className="space-x-2">
            <span>Total:</span>
            <span>RS</span>
            <span className="text-2xl">{cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="my-2 w-full border-b-2 border-dashed border-gray-300 p-1"></div>
      </div>
    </>
  );
}
