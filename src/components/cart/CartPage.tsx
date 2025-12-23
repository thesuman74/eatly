"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import CartItem from "./CartItem";
import CartFooter from "./CartFooter";
import useCartStore from "@/stores/user/userCartStore";
import BouncingText from "../animation/BouncingText";

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
            <span className="font-bold">
              <BouncingText
                text={total.toString()}
                className="text-xl font-bold"
              />
            </span>
          </div>
        </div>
        <div>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
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
