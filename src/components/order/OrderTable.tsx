"use client";

import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Clock, CalendarDays, CookingPot, Plus } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrderRowActions } from "./OrderRowAction/OrderRowActions";
import { timeAgo } from "@/utils/time";
import { formatCreatedDate } from "@/utils/date";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  OrderStatus,
  OrderActionState,
  Order,
  OrderPayment,
  PaymentStatus,
} from "@/lib/types/order-types";
import { PAYMENT_UI } from "@/lib/order/paymentUi";
import { getEffectivePaymentStatus } from "@/lib/order/paymentStautsHelper";
import { ORDER_STATUS_UI } from "@/lib/order/OrderStatusUI";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { TablePagination } from "../Pagination";

export type OrdersTableProps = {
  orders: Order[];
  onAccept: (id: string) => void;
  onFinish: (order: any) => void;
  onPay: (id: string) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
  openProductOrderSheet: (id: string) => void;
  actionState: OrderActionState;
};

export default function OrdersTable({
  orders,
  onAccept,
  onFinish,
  onPay,
  onStatusChange,
  onCancel,
  onDelete,
  openProductOrderSheet,
  actionState,
}: OrdersTableProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const columns: ColumnDef<Order>[] = [
    {
      header: "DATE",
      accessorFn: (row) => row.created_at,
      cell: ({ row }) => {
        const order = row.original;
        const statusUI = ORDER_STATUS_UI[order.status];

        const elapsed =
          (Date.now() - new Date(order.created_at).getTime()) / 1000;
        const timeColor = clsx(
          "text-xs font-medium transition-colors",
          elapsed < 300 && "text-green-600",
          elapsed >= 300 && elapsed < 900 && "text-yellow-600",
          elapsed >= 900 && "text-red-600 animate-pulse",
        );

        return (
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <span
                className={`
             ${statusUI.headerText}`}
              >
                {order.order_number}
              </span>
              <span
                className={`
             ${statusUI.headerText}`}
              >
                {"#" + order?.order_type}
              </span>
            </div>
            <div className={`flex items-center text-xs gap-1 ${timeColor}`}>
              <Clock size={14} /> {timeAgo(order.created_at)}
            </div>
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <CalendarDays size={14} /> {formatCreatedDate(order.created_at)}
            </div>
          </div>
        );
      },
    },
    {
      header: "STATUS",
      accessorFn: (row) => row.status,
      cell: ({ row }) => {
        const order = row.original;
        const statusUI = ORDER_STATUS_UI[order.status];

        return (
          <div className="space-y-2">
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
            ${statusUI.badgeBg} ${statusUI.badgeText}`}
            >
              {order.status.toUpperCase()}
            </span>
            <div className="text-xs ml-4 text-gray-500">
              {order.order_source.toUpperCase()}
            </div>
          </div>
        );
      },
    },
    {
      header: "TOTAL",
      accessorFn: (row) => row.total_amount,
      cell: ({ row }) => {
        const order = row.original;

        const paymentStatus = getEffectivePaymentStatus(order.payments);
        const paymentUI = PAYMENT_UI[paymentStatus];
        return (
          <div className="space-y-2 font-semibold text-sm">
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-bold
            ${paymentUI.badgeBg} ${paymentUI.badgeText}`}
            >
              {paymentStatus.toUpperCase()}
            </span>
            <div>Rs {order.total_amount}</div>
          </div>
        );
      },
    },
    {
      header: "CLIENT",
      accessorFn: (row) => row.customer_name,
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center text-xs text-gray-500 gap-1">
            {order.customer_name}
          </div>
        );
      },
    },
    {
      header: "ACTIONS",
      cell: ({ row }) => {
        const order = row.original;

        const loading = {
          accept:
            actionState.orderId === order.id && actionState.type === "accept",

          finish:
            actionState.orderId === order.id && actionState.type === "finish",

          status:
            actionState.orderId === order.id && actionState.type === "status",

          cancel:
            actionState.orderId === order.id && actionState.type === "cancel",

          delete:
            actionState.orderId === order.id && actionState.type === "delete",

          pay: false, // UI-only
        };
        return (
          <OrderRowActions
            order={order}
            loading={loading}
            onAccept={() => onAccept(order.id)}
            onFinish={() => onFinish(order)}
            onPay={() => onPay(order.id)}
            onStatusChange={(status) => onStatusChange(order.id, status)}
            onCancel={() => onCancel(order.id)}
            onDelete={() => onDelete(order.id)}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
  });

  if (orders.length === 0)
    return (
      <div className="p-4 text-center h-64 md:h-96 flex flex-col space-y-4 items-center justify-center">
        <CookingPot size={84} className="animate-bounce text-blue-600" />
        <div className="flex flex-col w-auto space-y-4">
          <span className="text-sm text-gray-500">Create New Orders</span>
          <span className=" text-gray-500">You don't have any orders</span>
          <Link
            href="order/new?type=onSite"
            className="flex items-center justify-center space-x-4"
          >
            <Button className="flex items-center justify-center space-x-4 py-8">
              <Plus size={60} />
              <span className="text-xl">New Order</span>
            </Button>
          </Link>
        </div>
      </div>
    );

  return (
    <>
      <div className="bg-background shadow mb-20 overflow-hidden">
        {/* ===== DESKTOP (lg+) ===== */}
        <div className="hidden lg:block">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-2 px-4 text-xs font-semibold text-gray-500 bg-background">
            <div className="col-span-2">DATE</div>
            <div className="col-span-2">STATUS</div>
            <div className="col-span-2">TOTAL</div>
            <div className="col-span-2">CLIENT</div>
            <div className="col-span-3 text-center">ACTIONS</div>
          </div>

          {/* Rows */}
          {table.getRowModel().rows.map((row) => {
            const cells = row.getVisibleCells();
            const statusUI = ORDER_STATUS_UI[row.original.status];

            return (
              <div
                key={row.id}
                className="relative grid grid-cols-12 gap-4 p-4 border items-center bg-card hover:bg-secondary cursor-pointer"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (!target.closest(".actions-cell")) {
                    openProductOrderSheet(row.original.id);
                  }
                }}
              >
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-[70%] w-1   ${statusUI.badgeBg} rounded`}
                />

                <div className="col-span-2">
                  {flexRender(
                    cells[0].column.columnDef.cell,
                    cells[0].getContext(),
                  )}
                </div>

                <div className="col-span-2">
                  {flexRender(
                    cells[1].column.columnDef.cell,
                    cells[1].getContext(),
                  )}
                </div>

                <div className="col-span-2">
                  {flexRender(
                    cells[2].column.columnDef.cell,
                    cells[2].getContext(),
                  )}
                </div>

                <div className="col-span-3">
                  {flexRender(
                    cells[3].column.columnDef.cell,
                    cells[3].getContext(),
                  )}
                </div>
                <div className="col-span-3">
                  {flexRender(
                    cells[4].column.columnDef.cell,
                    cells[4].getContext(),
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== MOBILE + TABLET (<lg) ===== */}
        <div className="block lg:hidden space-y-3 p-3">
          {table.getRowModel().rows.map((row) => {
            const order = row.original;

            const statusUI = ORDER_STATUS_UI[order.status];
            const paymentStatus = getEffectivePaymentStatus(order.payments);
            const paymentUI = PAYMENT_UI[paymentStatus];

            const elapsed =
              (Date.now() - new Date(order.created_at).getTime()) / 1000;
            const timeColor = clsx(
              "text-xs font-medium transition-colors",
              elapsed < 300 && "text-green-600",
              elapsed >= 300 && elapsed < 900 && "text-yellow-600",
              elapsed >= 900 && "text-red-600 animate-pulse",
            );

            const loading = {
              accept:
                actionState.orderId === order.id &&
                actionState.type === "accept",

              finish:
                actionState.orderId === order.id &&
                actionState.type === "finish",

              status:
                actionState.orderId === order.id &&
                actionState.type === "status",

              cancel:
                actionState.orderId === order.id &&
                actionState.type === "cancel",

              delete:
                actionState.orderId === order.id &&
                actionState.type === "delete",

              pay: false, // UI-only
            };

            return (
              <div
                key={order.id}
                className="relative  border-b p-3 space-y-2"
                onClick={() => openProductOrderSheet(order.id)}
              >
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-[70%] w-1 ${
                    statusUI.badgeBg
                  } rounded`}
                />

                {/* Row 1 */}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex gap-2 font-semibold">
                    <span className={statusUI.headerText}>
                      {order.order_number}
                    </span>
                    <span className={statusUI.headerText}>
                      #{order.order_type}
                    </span>
                  </div>
                  <span className={`flex items-center text-xs gap-1 `}>
                    {formatCreatedDate(order.created_at)}
                  </span>
                </div>

                {/* Row 2 */}
                <div className="flex justify-between items-center text-xs">
                  <div className="flex gap-2 flex-wrap">
                    <Badge
                      variant={"outline"}
                      className="text-muted-foreground "
                    >
                      {order.order_source}
                    </Badge>

                    <span
                      className={`px-2 py-0.5 rounded-full  font-semibold ${statusUI.badgeBg} ${statusUI.badgeText}`}
                    >
                      {order.status}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${paymentUI.badgeBg} ${paymentUI.badgeText}`}
                    >
                      {paymentStatus}
                    </span>
                  </div>

                  <span
                    className={`flex items-center text-xs gap-1 ${timeColor}`}
                  >
                    {" "}
                    {timeAgo(order.created_at)}
                  </span>
                </div>

                {/* Row 3 */}
                <div className="flex justify-between items-center text-md font-semibold">
                  <div className="space-x-4 md:space-x-8">
                    <span>Rs {order.total_amount}</span>
                    <span className="text-gray-600 text-xs">
                      {order?.customer_name}
                    </span>
                  </div>

                  <div
                    className="actions-cell"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <OrderRowActions
                      order={order}
                      loading={loading}
                      onAccept={() => onAccept(order.id)}
                      onFinish={() => onFinish(order)}
                      onPay={() => onPay(order.id)}
                      onStatusChange={(status) =>
                        onStatusChange(order.id, status)
                      }
                      onCancel={() => onCancel(order.id)}
                      onDelete={() => onDelete(order.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <TablePagination
          pageIndex={pageIndex}
          pageCount={table.getPageCount()}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </div>
    </>
  );
}
