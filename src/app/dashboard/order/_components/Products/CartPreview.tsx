"use client";
import { useCartStore } from "@/app/stores/useCartStore";
import { X } from "lucide-react";
import Link from "next/link";

export default function CartPreview() {
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();
  const cartTotal = useCartStore((state) => state.cartTotal());

  const paymentStatus = useCartStore((state) => state.paymentStatus);

  return (
    <>
      <div className="w-full max-w-md  bg-white border rounded shadow-md ">
        <div className="flex items-center justify-between border-b  ">
          <Link
            href={"/order/new"}
            className="font-bold text-lg w-full text-white bg-blue-500 p-2"
          >
            + Products
          </Link>
          {/* <div className="text-gray-400">Kitchen</div> */}
        </div>

        <div className="mt-2 min-h-[250px] max-h-[250px] overflow-y-auto px-2 ">
          {cartItems.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex items-center gap-4 mb-4 bg-gray-100 rounded-lg p-1"
            >
              <img
                src={product?.images[0]?.url || "/Images/coffee.png"}
                alt={product.name}
                className="h-16 w-16 object-cover rounded-lg"
              />
              <div className="flex flex-1 flex-col ">
                <div className="flex justify-between w-full items-center">
                  <h4 className="w-full line-clamp-1 font-semibold">
                    {product.name}
                  </h4>
                  <span>${product.price}</span>
                  <button
                    className="text-gray-500 px-2"
                    onClick={() => removeFromCart(product.id)}
                  >
                    <X />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center space-y-2 space-x-2 text-sm text-nowrap px-2 py-2">
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
              paymentStatus === "Paid" ? "bg-green-600" : "bg-yellow-400"
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
