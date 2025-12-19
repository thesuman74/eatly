import { ORDER_STATUS, OrderStatus } from "@/lib/types/order-types";

import { OrderOverflowMenu } from "./OrderOverflowMenu";
import { PrimaryOrderButton } from "./PrimaryOrderAction";
import { OrderStatusActions } from "../OrderStatusActions";
import { PayButton } from "./PayButton";

export function OrderRowActions({
  order,
  loading,
  onAccept,
  onFinish,
  onPay,
  onStatusChange,
  onCancel,
  onDelete,
}: {
  order: any;
  loading: {
    accept?: boolean;
    finish?: boolean;
    pay?: boolean;
    status?: boolean;
  };
  onAccept: () => void;
  onFinish: () => void;
  onPay: () => void;
  onStatusChange: (s: OrderStatus) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const showPay =
    order.status !== ORDER_STATUS.DRAFT && order.payment_status !== "PAID";

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Status change only after accept */}
      {order.status !== ORDER_STATUS.DRAFT && (
        <OrderStatusActions
          onStatusChange={onStatusChange}
          loading={loading.status}
        />
      )}
      <PayButton onPay={onPay} /> {/* Primary CTA */}
      <PrimaryOrderButton
        order={order}
        loading={loading}
        onAccept={onAccept}
        onFinish={onFinish}
        onPay={onPay}
      />
      {/* Overflow actions */}
      <OrderOverflowMenu onCancel={onCancel} onDelete={onDelete} />
    </div>
  );
}
