// app/stores/useCartStore.ts
import { create } from "zustand";
import { ProductTypes } from "@/lib/types/menu-types";
import {
  OrderType,
  PaymentStatus,
  OrderStatus,
  PaymentMethod,
  OrderItemAddon,
  OrderItem,
  Order,
} from "@/lib/types/order-types";

// export interface CartItem {
//   product: ProductTypes;
//   quantity: number;
//   addons?: OrderItemAddon[];
// }

interface CartState {
  // Cart
  cartItems: OrderItem[];
  setCartItems: (items: OrderItem[]) => void;

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

  currentlyActiveOrderId: string; // initialized as empty
  setCurrentlyActiveOrderId: (orderId: string) => void;

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
  setCartItems: (items: OrderItem[]) => set({ cartItems: items }),

  currentlyActiveOrderId: "",

  setCurrentlyActiveOrderId: (orderId: string) =>
    set({ currentlyActiveOrderId: orderId }),

  cartTotal: () =>
    get().cartItems.reduce(
      (total, item) =>
        total +
        item.unit_price * item.quantity +
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
      (item) => item.product_id === product.id
    );

    if (existing) {
      // update quantity and addons

      console.log("existing item found:", existing);
      set({
        cartItems: get().cartItems.map((item) =>
          item.product_id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total_price:
                  (item.unit_price ?? product.price) * (item.quantity + 1),
                addons: addons || item.addons,
              }
            : item
        ),
      });
    } else {
      // add new item with required fields
      console.log("new item:", existing);

      set({
        cartItems: [
          ...get().cartItems,
          {
            id: crypto.randomUUID(),
            product_id: product.id,
            product,
            name: product.name,
            quantity: 1,
            unit_price: product.price ?? 0, // use product.price
            total_price: product.price ?? 0, // initial total
            addons: addons || [],
          } as OrderItem,
        ],
      });
    }
  },

  removeFromCart: (productId) => {
    set({
      cartItems: get().cartItems.filter(
        (item) => item?.product?.id !== productId
      ),
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
    } else {
      set({
        cartItems: get().cartItems.map((item) =>
          item.product?.id === productId ? { ...item, quantity } : item
        ),
      });
    }
  },

  updateItemAddons: (productId, addons) => {
    set({
      cartItems: get().cartItems.map((item) =>
        item.product?.id === productId ? { ...item, addons } : item
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
      product_id: item?.product?.id,
      name: item?.product?.name,
      quantity: item.quantity,
      unit_price: item.product?.price,
      total_price:
        (item?.product?.price || 0) * item.quantity +
        (item.addons?.reduce(
          (a, addon) => a + addon.price * addon.quantity,
          0
        ) || 0),
      addons: item.addons || [],
    })),
  }),
}));
