import { ProductTypes } from "@/lib/types/menu-types";
import { OrderType, PaymentMethod } from "@/lib/types/order-types";
import { create } from "zustand";

export interface cartItem extends ProductTypes {
  quantity: number;
}

interface CustomerInfo {
  name?: string;
  phone?: string;
  address?: string;
}

interface PaymentInfo {
  method?: PaymentMethod;
  amount?: number;
  tip?: number;
}

interface userCartStore {
  cartItems: cartItem[];
  restaurant_id?: string;

  total: number;
  customer?: CustomerInfo;
  payment?: PaymentInfo;
  order_type?: OrderType;

  setRestaurantId: (restaurantId: string) => void;
  setOrderType: (orderType: OrderType) => void;

  setCustomer: (customer: CustomerInfo) => void;
  setPayment: (payment: PaymentInfo) => void;
  addToCart: (product: ProductTypes, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
}

const useCartStore = create<userCartStore>((set, get) => {
  const calculateTotal = (cartItems: cartItem[]) =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return {
    cartItems: [],
    restaurant_id: undefined,

    total: 0,
    customer: undefined,
    payment: undefined,

    // --- Order type ---
    setOrderType: (orderType) => set({ order_type: orderType }),

    // --- Customer info ---
    setCustomer: (customer) => set({ customer }),

    // --- Payment info ---
    setPayment: (payment) => set({ payment }),

    // --- Cart actions ---
    setRestaurantId: (restaurantId) => set({ restaurant_id: restaurantId }),

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

    clearCart: () =>
      set({
        cartItems: [],
        total: 0,
        customer: undefined,
        payment: undefined,
      }),
  };
});

export default useCartStore;
