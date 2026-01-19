"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import React, { useEffect, useState } from "react";
import { Calendar, Check, Clock, Hash, Utensils, X } from "lucide-react";
import {
  useCreateOrder,
  useDeleteOrderItem,
  useOrder,
  useUpdateOrder,
  useUpdateOrderItem,
  useUpdateOrderStatus,
} from "@/hooks/order/useOrders";
import { getElapsedSeconds, timeAgo } from "@/utils/time";
import { formatCreatedDate } from "@/utils/date";
import PaymentSummary from "@/app/dashboard/[restaurantId]/order/_components/payments/PaymentSummary";
import { useOrderWorkspace } from "@/stores/workspace/useOrderWorkspace";
import { useCartStore } from "@/stores/admin/useCartStore";
import {
  ORDER_STATUS,
  OrderActionState,
  OrderPayment,
  PAYMENT_STATUS,
  PaymentStatus,
} from "@/lib/types/order-types";
import { paymentPanelStore } from "@/stores/ui/paymentPanelStore";
import { Spinner } from "../Spinner";
import { useSecondTicker } from "@/hooks/useSecondTicker";
import clsx from "clsx";
import { useRestaurantStore } from "@/stores/admin/restaurantStore";
import EditableOrderItemsList from "@/app/dashboard/[restaurantId]/order/_components/Products/EditableOrderItemsList";
import { PAYMENT_UI } from "@/lib/order/paymentUi";
import { can } from "@/lib/rbac/can";
import { OrderActionButtons } from "../order/OrderRowAction/OrderActionButton";
import { usePaymentRefund } from "@/hooks/order/usePayements";
import { buildOrderPayload } from "@/utils/buildOrderPayload";
import { toast } from "react-toastify";

type OrderActionType =
  | "accept"
  | "finalize"
  | "register"
  | "refund"
  | "registerAndAccept";

const ProductOrdersheet = () => {
  // Store hooks
  const { orderId } = useOrderWorkspace();
  const { isProductOrderSheetOpen, closeProductOrderSheet } =
    useOrderWorkspace();
  const {
    orderId: currentOrderId,
    isPaymentSheetOpen,
    openpaymentPanelStore,
    closepaymentPanelStore,
  } = paymentPanelStore();
  const restaurantId = useRestaurantStore((state) => state.restaurantId);

  // Order data
  const { data, isLoading, error } = useOrder(orderId, restaurantId);

  // Mutations
  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const paymentRefundMutation = usePaymentRefund();

  // Cart store
  const {
    currentlyActiveOrderId,
    setCurrentlyActiveOrderId,
    customerName,
    orderTitle,
    cartItems,
    clearCart,
    setCartItems,
    setCustomerName,
    setOrderTitle,
  } = useCartStore();
  const cartTotal = useCartStore((state) => state.cartTotal());

  // Loading state for order actions
  const [loadingActionState, setLoadingActionState] = useState<
    Record<OrderActionType, boolean>
  >({
    accept: false,
    finalize: false,
    register: false,
    refund: false,
    registerAndAccept: false,
  });

  // Compute derived values
  const elapsed = getElapsedSeconds(data?.created_at);
  const timeColor = clsx(
    "text-xs font-medium transition-colors",
    elapsed < 300 && "text-green-600", // < 5 min
    elapsed >= 300 && elapsed < 900 && "text-yellow-600", // 5–15 min
    elapsed >= 900 && "text-red-600", // > 15 min
  );

  const payments: OrderPayment[] = data?.payments || [];

  // If `payments` is an array of payment objects with payment_status
  const paymentStatus: PaymentStatus = (() => {
    if (!payments || payments.length === 0) return PAYMENT_STATUS.UNPAID;

    if (payments.some((p) => p.payment_status === PAYMENT_STATUS.REFUNDED)) {
      return PAYMENT_STATUS.REFUNDED;
    }

    if (payments.some((p) => p.payment_status === PAYMENT_STATUS.PAID)) {
      return PAYMENT_STATUS.PAID;
    }

    return PAYMENT_STATUS.UNPAID;
  })();
  const paymentUI = PAYMENT_UI[paymentStatus];

  const showPaymentPanelForThisOrder =
    isPaymentSheetOpen && currentOrderId === data?.id;

  // Initialize cart when order changes
  useEffect(() => {
    if (!data || !orderId) return;

    setCurrentlyActiveOrderId(orderId);
    setCartItems(data.items || []);
    setCustomerName(data.customer_name || "");
    setOrderTitle(data.order_title || "");
  }, [data, orderId]);

  // Handlers

  const handleRegisterAndAcceptOrder = async () => {
    if (!currentlyActiveOrderId) return;

    const payload = buildOrderPayload(restaurantId);
    setLoadingActionState((prev) => ({ ...prev, registerAndAccept: true }));

    try {
      if (currentlyActiveOrderId) {
        await updateOrderMutation.mutateAsync({
          id: currentlyActiveOrderId,
          payload,
        });
      } else {
        await createOrderMutation.mutateAsync(payload);
      }
      setCurrentlyActiveOrderId("");
      toast.success("Payment registered and order accepted");
    } catch (error: any) {
      toast.error(error.message || "Failed to register order");
    } finally {
      setLoadingActionState((prev) => ({ ...prev, registerAndAccept: false }));
    }
  };

  const handleRefundPayment = async () => {
    if (!currentlyActiveOrderId) {
      toast.error("No active order to refund");
      return;
    }
    await paymentRefundMutation.mutateAsync({
      orderId: currentlyActiveOrderId,
      restaurantId,
    });
    closepaymentPanelStore();
  };

  const handleFinalizeOrder = async () => {
    try {
      await updateOrderStatusMutation.mutateAsync({
        id: currentlyActiveOrderId,
        status: ORDER_STATUS.COMPLETED,
      });
      closepaymentPanelStore();
      closeProductOrderSheet();
      clearCart();
      setCurrentlyActiveOrderId("");
    } catch (error: any) {
      toast.error(error.message || "Failed to finalize order");
    }
  };

  const handleSaveAsPending = () => {
    // Clear or reset cart/order related state in the parent if needed
    setCurrentlyActiveOrderId("");
    setCustomerName("");
    setOrderTitle("");

    toast.success("Order saved as pending");
  };

  const handleAccept = async () => {
    setLoadingActionState((prev) => ({ ...prev, accept: true }));
    try {
      await updateOrderStatusMutation.mutateAsync({
        id: currentlyActiveOrderId,
        status: ORDER_STATUS.ACCEPTED,
      });
      closepaymentPanelStore();
    } catch (error: any) {
      toast.error(error.message || "Failed to accept order");
    } finally {
      setLoadingActionState((prev) => ({ ...prev, accept: false }));
    }
  };

  if (!isProductOrderSheetOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-md border bg-background px-4 py-2 shadow-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <span className="text-sm text-muted-foreground">
            Loading order details…
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <section>
        {isProductOrderSheetOpen && (
          <aside
            className="h-[calc(100vh-4rem)]
 fixed top-16 right-0  max-w-sm w-full flex flex-col border border-t-0 bg-secondary "
          >
            {showPaymentPanelForThisOrder ? (
              <PaymentSummary
                open={showPaymentPanelForThisOrder}
                setOpen={closepaymentPanelStore}
                payments={data.payments}
                onRegisterAndAccept={handleRegisterAndAcceptOrder}
                onRefund={handleRefundPayment}
                onSaveAsPending={handleSaveAsPending}
                onFinalize={handleFinalizeOrder}
                loading={loadingActionState}
                payment_status={paymentStatus}
              />
            ) : (
              <>
                {/* Top Section */}
                <div className="shrink-0 ">
                  <div
                    className={`flex items-center  px-4 py-2 ${paymentUI.headerBg}`}
                  >
                    <div className="flex space-x-2 items-center">
                      <Hash />
                      <span className="text-lg font-semibold">1</span>
                    </div>

                    <div className="flex space-x-4 items-center px-1">
                      <Utensils size={20} />
                      <span className="px-1">
                        {data?.orderType?.toUpperCase() || "On site"}
                      </span>
                      <span>|</span>
                      <span>{data?.status.toUpperCase()}</span>
                    </div>

                    <button
                      className="ml-auto p-2 rounded hover:bg-gray-100 transition"
                      onClick={closeProductOrderSheet}
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center dark:bg-secondary bg-yellow-50/80 px-2">
                    <div className="flex justify-between py-2">
                      <span className="font-semibold bg-background px-4 py-1 mx-1 rounded-full text-xs">
                        POS
                      </span>
                      <div className="flex items-center">
                        <span>
                          <Calendar size={16} />
                        </span>
                        <span>{formatCreatedDate(data?.created_at)}</span>
                      </div>
                    </div>

                    <div>
                      <div
                        className={`flex  items-center justify-center space-x-2 ${timeColor}`}
                      >
                        <span>
                          <Clock size={16} />
                        </span>
                        <span className="text-sm">
                          {timeAgo(data?.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <hr className="border-gray-400" />

                  <div className="space-y-2 py-2 bg-background">
                    <Input
                      type="text"
                      name="product_title"
                      placeholder="Add title"
                      value={orderTitle}
                      onChange={(e) => setOrderTitle(e.target.value)}
                      className="w-full border"
                    />

                    <Input
                      type="text"
                      name="client_name"
                      placeholder="Add Client Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full border text-lg"
                    />
                  </div>
                </div>

                {/* Middle (scrollable) */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <EditableOrderItemsList itemsWithDetails={cartItems} />

                  {/* total and discount section  */}
                  <div className="flex flex-wrap items-center space-y-2 space-x-2 text-sm text-nowrap px-2 py-2">
                    <div></div>
                    <button className="rounded-md bg-green-500 px-4 py-1 text-gray-700">
                      + Discount
                    </button>
                    <button className="rounded-md bg-gray-200 px-3 py-1 text-gray-700">
                      + Servicing
                    </button>
                    <button className="rounded-md bg-gray-200 px-3 py-1 text-gray-700">
                      + Packaging
                    </button>
                    <div className="my-2 w-full border-b-2 border-dashed border-gray-300 dark:border-gray-600 p-1"></div>

                    <div className="flex justify-between w-full items-center px-1">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold
  ${paymentUI.headerBg} ${paymentUI.badgeText}`}
                      >
                        {paymentUI.label}
                      </span>
                      <div className="space-x-2">
                        <span>Total:</span>
                        <span>RS</span>
                        <span className="text-2xl">{cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="my-2 w-full border-b-2 border-dashed border-gray-300 dark:border-gray-600 p-1"></div>
                  </div>
                </div>
                {/* Bottom Section */}
                <div className="flex flex-wrap pb-4 items-center space-y-2 space-x-2 text-sm text-nowrap px-2">
                  <OrderActionButtons
                    order={data}
                    onPay={() => openpaymentPanelStore(data.id)}
                    onAccept={() => handleAccept()}
                    onFinalize={() => handleFinalizeOrder()}
                    onClose={() => closeProductOrderSheet()}
                    onOpenPaymentSummary={() => openpaymentPanelStore(data.id)}
                    loading={loadingActionState}
                  />
                </div>
              </>
            )}
          </aside>
        )}
      </section>
    </>
  );
};

export default ProductOrdersheet;
