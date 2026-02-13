"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import CartItem from "./CartItem";
import CartFooter from "./CartFooter";
import useCartStore from "@/stores/user/userCartStore";
import BouncingText from "../animation/BouncingText";
import { ArrowRight, ShoppingCart } from "lucide-react";

const CartPage = () => {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const { cartItems, total } = useCartStore();

  const handleServiceClick = (serviceType: string) => {
    setSelectedService(serviceType);
    setIsDialogOpen(true);
  };

  return (
    <>
      <section className="max-w-7xl mx-auto">
        <div className="flex w-full justify-between  px-4 py-2">
          <div
            className="flex items-center space-x-2 hover:text-blue-500"
            onClick={() => router.back()}
          >
            <span>
              <FaArrowLeft />
            </span>
            <span className="font-bold">Back</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500">Your Cart</span>
            <div className="font-bold flex space-x-2 items-center">
              <span>RS</span>
              <BouncingText
                text={total.toString()}
                className="text-xl font-bold"
              />
            </div>
          </div>
        </div>
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeIn">
            {/* Animated Icon */}
            <div className="mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 p-8 shadow-inner animate-float">
              <ShoppingCart size={52} className="text-gray-400" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Your Cart is Empty
            </h2>

            {/* Subtitle */}
            <p className="text-gray-500 mb-8 max-w-sm">
              Looks like you haven’t added anything yet. Please find something
              amazing for you.
            </p>

            {/* CTA Button
            <button className="group flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
              Start Shopping
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button> */}
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Service Buttons and Dialog */}
      <CartFooter onServiceClick={handleServiceClick} />

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded">
            <h3 className="text-lg font-semibold">
              Selected Service: {selectedService}
            </h3>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
