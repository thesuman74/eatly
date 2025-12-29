"use client";

import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  Row,
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
} from "@/lib/types/order-types";

export type OrdersTableProps = {
  orders: any[];
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
  const columns: ColumnDef<any>[] = [
    {
      header: "DATE",
      accessorFn: (row) => row.created_at,
      cell: ({ row }) => {
        const order = row.original;
        const elapsed =
          (Date.now() - new Date(order.created_at).getTime()) / 1000;
        const timeColor = clsx(
          "text-xs font-medium transition-colors",
          elapsed < 300 && "text-green-600",
          elapsed >= 300 && elapsed < 900 && "text-yellow-600",
          elapsed >= 900 && "text-red-600 animate-pulse"
        );

        return (
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <span
                className={
                  order.status === ORDER_STATUS.DRAFT
                    ? "text-orange-500"
                    : "text-green-600"
                }
              >
                {order.order_number}
              </span>
              <span
                className={`font-semibold text-md ${
                  order.status === ORDER_STATUS.DRAFT
                    ? "text-orange-500"
                    : "text-green-600"
                }`}
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
        return (
          <div className="space-y-2">
            <div
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                [ORDER_STATUS.DRAFT, "Preparing"].includes(order.status)
                  ? "bg-green-300 text-black/60"
                  : "bg-blue-300 text-black/60"
              }`}
            >
              {order.status.toUpperCase()}
            </div>
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
        return (
          <div className="space-y-2 font-semibold text-sm">
            <div
              className={`inline-block px-2 py-1 ${
                order.payment_status === PAYMENT_STATUS.PAID
                  ? "bg-green-500"
                  : "bg-orange-400"
              } capitalize text-white rounded-full text-xs font-bold`}
            >
              {order.payment_status}
            </div>
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
  });

  if (orders.length === 0)
    return (
      <div className="p-4 text-center h-64 md:h-96 flex flex-col space-y-4 items-center justify-center">
        <CookingPot size={84} className="animate-bounce text-blue-600" />
        <div className="flex flex-col w-auto space-y-4">
          <span className="text-sm text-gray-500">Create New Orders</span>
          <Button className="flex items-center justify-center space-x-4 py-8">
            <Link
              href="order/new?type=onSite"
              className="flex items-center justify-center space-x-4"
            >
              <Plus size={60} />
              <span className="text-xl">New Order</span>
            </Link>
          </Button>
        </div>
      </div>
    );

  return (
    <div className="bg-white rounded-md shadow overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 p-2 px-4 text-xs font-semibold text-gray-500 bg-gray-100">
        <div className="col-span-2">DATE</div>
        <div className="col-span-2">STATUS</div>
        <div className="col-span-2">TOTAL</div>
        <div className="col-span-3">CLIENT</div>
        <div className="col-span-3 text-center">ACTIONS</div>
      </div>

      {/* Rows */}
      {table.getRowModel().rows.map((row) => {
        const cells = row.getVisibleCells();
        return (
          <div
            key={row.id}
            className="relative grid grid-cols-12 gap-4 p-4 hover:cursor-pointer hover:bg-blue-50 border items-center bg-gray-50"
            onClick={(e) => {
              // Only trigger sheet when clicking on the left columns (DATE, STATUS, TOTAL, CLIENT)
              const target = e.target as HTMLElement;
              if (!target.closest(".actions-cell")) {
                openProductOrderSheet(row.original.id);
              }
            }}
          >
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 h-[70%] w-1 ${
                row.original.status === ORDER_STATUS.DRAFT
                  ? "bg-yellow-500"
                  : "bg-green-500"
              } rounded`}
            />

            {/* DATE */}
            <div className="col-span-2">
              {flexRender(
                cells[0].column.columnDef.cell,
                cells[0].getContext()
              )}
            </div>

            {/* STATUS */}
            <div className="col-span-2">
              {flexRender(
                cells[1].column.columnDef.cell,
                cells[1].getContext()
              )}
            </div>

            {/* TOTAL */}
            <div className="col-span-2">
              {flexRender(
                cells[2].column.columnDef.cell,
                cells[2].getContext()
              )}
            </div>

            {/* CLIENT */}
            <div className="col-span-3">
              {flexRender(
                cells[3].column.columnDef.cell,
                cells[3].getContext()
              )}
            </div>

            {/* ACTIONS */}
            <div
              className="col-span-3 flex justify-end actions-cell"
              onClick={(e) => e.stopPropagation()} // <- prevents row click when any button inside is clicked
            >
              {flexRender(
                cells[4].column.columnDef.cell,
                cells[4].getContext()
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
