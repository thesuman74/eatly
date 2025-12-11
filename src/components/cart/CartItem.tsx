import { ProductTypes } from "@/lib/types/menu-types";
import useCartStore, { cartItem } from "@/stores/user/userCartStore";
import { Trash2 } from "lucide-react";
import BouncingText from "../animation/BouncingText";

interface CartItemProps {
  item: cartItem; // or your cart item type if different
}
const CartItem = ({ item }: CartItemProps) => {
  const { incrementQuantity, decrementQuantity, removeFromCart } =
    useCartStore();

  return (
    <div className="flex items-center justify-between border-b border-input px-8 py-4 text-sm">
      <div className="flex items-center space-x-4">
        <img
          src={item?.images[0]?.url || "/Images/coffee.png"}
          alt={item.name}
          className="size-14 rounded-xl object-cover object-top"
        />
        <div className="flex flex-col text-sm">
          <span className="line-clamp-1">{item.name}</span>
          <span className="font-bold">Rs {item.price}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Decrement Button */}
        <button
          onClick={() => decrementQuantity(item.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors text-lg font-bold"
        >
          -
        </button>

        {/* Quantity Display */}
        <span className="w-6 text-center font-medium">
          <BouncingText
            text={item.quantity.toString()}
            className="text-xl font-bold"
          />
        </span>

        {/* Increment Button */}
        <button
          onClick={() => incrementQuantity(item.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors text-lg font-bold"
        >
          +
        </button>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors shadow-md"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
