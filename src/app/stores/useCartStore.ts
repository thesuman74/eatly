// app/stores/useCartStore.ts
import { create } from "zustand";
import { ProductTypes } from "@/lib/types/menu-types";
import {
  OrderType,
  PaymentStatus,
  OrderStatus,
  PaymentMethod,
  OrderItemAddon,
} from "@/lib/types/order-types";

export interface CartItem {
  product: ProductTypes;
  quantity: number;
  addons?: OrderItemAddon[];
}

interface CartState {
  // Cart
  cartItems: CartItem[];
  cartTotal: () => number;

  // Order metadata
  customerName?: string;
  orderTitle?: string;
  orderType: OrderType;
  notes?: string;

  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  tips?: number;
  amountReceived?: number;

  // Order lifecycle
  orderStatus: OrderStatus;

  // Actions
  setCustomerName: (name: string) => void;
  setOrderTitle: (title: string) => void;
  setOrderType: (type: OrderType) => void;
  setNotes: (notes: string) => void;

  setPaymentStatus: (status: PaymentStatus) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setTips: (amount: number) => void;
  setAmountReceived: (amount: number) => void;

  setOrderStatus: (status: OrderStatus) => void;

  addToCart: (product: ProductTypes, addons?: OrderItemAddon[]) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemAddons: (productId: string, addons: OrderItemAddon[]) => void;
  clearCart: () => void;

  // Derived helpers
  totalToPay: () => number;
  getOrderPayload: () => any;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  cartTotal: () =>
    get().cartItems.reduce(
      (total, item) =>
        total +
        item.product.price * item.quantity +
        (item.addons?.reduce(
          (a, addon) => a + addon.price * addon.quantity,
          0
        ) || 0),
      0
    ),

  customerName: "",
  orderTitle: "",
  orderType: "OnSite",
  notes: "",

  paymentStatus: "Pending",
  paymentMethod: undefined,
  tips: 0,
  amountReceived: 0,

  orderStatus: "Pending",

  setCustomerName: (name) => set({ customerName: name }),
  setOrderTitle: (title) => set({ orderTitle: title }),
  setOrderType: (type) => set({ orderType: type }),
  setNotes: (notes) => set({ notes }),

  setPaymentStatus: (status) => set({ paymentStatus: status }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setTips: (amount) => set({ tips: amount }),
  setAmountReceived: (amount) => set({ amountReceived: amount }),

  setOrderStatus: (status) => set({ orderStatus: status }),

  addToCart: (product, addons) => {
    const existing = get().cartItems.find(
      (item) => item.product.id === product.id
    );
    if (existing) {
      set({
        cartItems: get().cartItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                addons: addons || item.addons,
              }
            : item
        ),
      });
    } else {
      set({
        cartItems: [...get().cartItems, { product, quantity: 1, addons }],
      });
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

  updateItemAddons: (productId, addons) => {
    set({
      cartItems: get().cartItems.map((item) =>
        item.product.id === productId ? { ...item, addons } : item
      ),
    });
  },

  clearCart: () =>
    set({
      cartItems: [],
      customerName: "",
      orderTitle: "",
      notes: "",
      tips: 0,
      amountReceived: 0,
      paymentMethod: undefined,
      paymentStatus: "Pending",
      orderStatus: "Pending",
      orderType: "OnSite",
    }),

  totalToPay: () => get().cartTotal() + (get().tips || 0),

  getOrderPayload: () => ({
    customer_name: get().customerName,
    order_type: get().orderType,
    title: get().orderTitle,
    notes: get().notes,
    payment_status: get().paymentStatus,
    payment: {
      method: get().paymentMethod,
      amount_paid: get().amountReceived,
      tip: get().tips,
    },
    items: get().cartItems.map((item) => ({
      product_id: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      total_price:
        item.product.price * item.quantity +
        (item.addons?.reduce(
          (a, addon) => a + addon.price * addon.quantity,
          0
        ) || 0),
      addons: item.addons || [],
    })),
  }),
}));
