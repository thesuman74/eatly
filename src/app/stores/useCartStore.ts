import { ProductTypes } from "@/lib/types/menu-types";
import { create } from "zustand";

interface CartItem {
  product: ProductTypes;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: ProductTypes) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  cartTotal: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],

  addToCart: (product) => {
    const existing = get().cartItems.find(
      (item) => item.product.id === product.id
    );
    if (existing) {
      set({
        cartItems: get().cartItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ cartItems: [...get().cartItems, { product, quantity: 1 }] });
    }
  },

  removeFromCart: (productId) => {
    set({
      cartItems: get().cartItems.filter(
        (item) => item.product.id !== productId
      ),
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
    } else {
      set({
        cartItems: get().cartItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      });
    }
  },

  cartTotal: () =>
    get().cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ),

  clearCart: () => set({ cartItems: [] }),
}));
