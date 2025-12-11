import { ProductTypes } from "@/lib/types/menu-types";
import { create } from "zustand";

export interface cartItem extends ProductTypes {
  quantity: number;
}

interface userCartStore {
  cartItems: cartItem[];
  total: number;
  addToCart: (product: ProductTypes, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
}

const useCartStore = create<userCartStore>((set, get) => {
  // helper function to calculate total
  const calculateTotal = (cartItems: cartItem[]) =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return {
    cartItems: [],
    total: 0,
    addToCart: (product, quantity = 1) => {
      set((state) => {
        const existing = state.cartItems.find((item) => item.id === product.id);
        let newCart;
        if (existing) {
          newCart = state.cartItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newCart = [...state.cartItems, { ...product, quantity }];
        }

        return {
          cartItems: newCart,
          total: calculateTotal(newCart),
        };
      });
    },
    removeFromCart: (id) => {
      set((state) => {
        const newCart = state.cartItems.filter((item) => item.id !== id);
        return { cartItems: newCart, total: calculateTotal(newCart) };
      });
    },
    incrementQuantity: (id) => {
      set((state) => {
        const newCart = state.cartItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        return { cartItems: newCart, total: calculateTotal(newCart) };
      });
    },
    decrementQuantity: (id) => {
      set((state) => {
        const newCart = state.cartItems.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
            : item
        );
        return { cartItems: newCart, total: calculateTotal(newCart) };
      });
    },
    clearCart: () => set({ cartItems: [], total: 0 }),
  };
});

export default useCartStore;
