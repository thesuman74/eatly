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
  ORDER_STATUS,
  PAYMENT_STATUS,
  ORDER_TYPES,
} from "@/lib/types/order-types";
import { v4 as uuidv4 } from "uuid";

// export interface CartItem {
//   product: ProductTypes;
//   quantity: number;
//   addons?: OrderItemAddon[];
// }

export interface CartState {
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
          0,
        ) || 0),
      0,
    ),

  customerName: "",
  orderTitle: "",
  orderType: ORDER_TYPES.ON_SITE,
  notes: "",

  paymentStatus: PAYMENT_STATUS.UNPAID,
  paymentMethod: "cash",
  tips: 0,
  amountReceived: 0,

  orderStatus: ORDER_STATUS.DRAFT,

  setCustomerName: (name) => set({ customerName: name }),
  setOrderTitle: (title) => set({ orderTitle: title }),
  setOrderType: (type) => set({ orderType: type }),
  setNotes: (notes) => set({ notes }),

  setPaymentStatus: (status) => set({ paymentStatus: status }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setTips: (amount) => set({ tips: amount }),
  setAmountReceived: (amount) => set({ amountReceived: amount }),

  setOrderStatus: (status) => set({ orderStatus: status }),

  addToCart: (product, addons, quantity = 1) => {
    const cart = get().cartItems;
    const isExistingOrder = !!get().currentlyActiveOrderId;

    // Determine action
    const action = isExistingOrder ? "update" : "add";

    if (action === "add") {
      // Always insert new "add" item for a new order
      set({
        cartItems: [
          ...cart,
          {
            id: uuidv4(),
            product_id: product.id,
            product,
            name: product.name,
            quantity,
            unit_price: product.price ?? 0,
            total_price: (product.price ?? 0) * quantity,
            addons: addons || [],
            action, // always "add"
            order_id: get().currentlyActiveOrderId || undefined,
          } as OrderItem,
        ],
      });
    } else if (action === "update") {
      // Check if there is already an "update" row for this product
      const existingUpdateIndex = cart.findIndex(
        (item) => item.product_id === product.id && item.action === "update",
      );

      if (existingUpdateIndex !== -1) {
        // Merge quantity for existing "update" row
        const updatedItem = { ...cart[existingUpdateIndex] };
        updatedItem.quantity += quantity;
        updatedItem.total_price = updatedItem.unit_price * updatedItem.quantity;

        const newCart = [...cart];
        newCart[existingUpdateIndex] = updatedItem;

        set({ cartItems: newCart });
      } else {
        // Insert new "update" row
        set({
          cartItems: [
            ...cart,
            {
              id: crypto.randomUUID(),
              product_id: product.id,
              product,
              name: product.name,
              quantity,
              unit_price: product.price ?? 0,
              total_price: (product.price ?? 0) * quantity,
              addons: addons || [],
              action: "update",
              order_id: get().currentlyActiveOrderId || undefined,
            } as OrderItem,
          ],
        });
      }
    }
  },

  removeFromCart: (productId) => {
    set({
      cartItems: get().cartItems.filter(
        (item) => item?.product?.id !== productId,
      ),
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
    } else {
      set({
        cartItems: get().cartItems.map((item) =>
          // Only allow quantity change for "update" items
          item.product_id === productId && item.action === "update"
            ? { ...item, quantity, total_price: item.unit_price * quantity }
            : item,
        ),
      });
    }
  },

  updateItemAddons: (productId, addons) => {
    set({
      cartItems: get().cartItems.map((item) =>
        item.product?.id === productId ? { ...item, addons } : item,
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
      paymentMethod: "cash",
      paymentStatus: PAYMENT_STATUS.UNPAID,
      orderStatus: ORDER_STATUS.DRAFT,
      orderType: ORDER_TYPES.ON_SITE,
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
          0,
        ) || 0),
      addons: item.addons || [],
    })),
  }),
}));
