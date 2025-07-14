"use client";

import {
  Check,
  X,
  DollarSign,
  Printer,
  MoreVertical,
  Clock,
  CalendarDays,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CounterTableFilters from "./CounterTableFilters";

export default function CounterTable() {
  const orders = [
    {
      id: "#4",
      type: "Onsite",
      status: "Pending",
      time: "60:00 min",
      pos: "NP-4010",
      client: "Suman Adhikari",
      date: "13/07/25 10:53",
      total: 0,
      paid: false,
    },
    {
      id: "#3",
      type: "Onsite",
      status: "Preparing",
      time: "60:00 min",
      pos: "NP-7718",
      client: "Suman Adhikari",
      date: "13/07/25 10:51",
      total: 4,
      paid: false,
    },
  ];

  const [open, setOpen] = useState(false);
  return (
    <>
      <div>
        <CounterTableFilters />
      </div>
      <div className="bg-white rounded-md shadow overflow-hidden ">
        {/* Header */}
        <div
          className="grid grid-cols-12 gap-4 p-2 px-4 text-xs font-semibold text-gray-500 bg-gray-100 
      "
        >
          <div className="col-span-2">DATE</div>
          <div className="col-span-2">STATUS</div>
          <div className="col-span-2">TOTAL</div>
          <div className="col-span-3">CLIENT</div>
          <div className="col-span-3 text-center">ACTIONS</div>
        </div>

        {/* Orders */}
        {orders.map((order, i) => (
          <div
            key={i}
            className={`relative grid grid-cols-12 gap-4 p-4 border items-center ${
              order.status !== "Pending" && "bg-gray-50"
            }`}
          >
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 h-[70%] w-1 ${
                order.status === "Pending" ? "bg-yellow-500" : "bg-green-500"
              } bg-green-500 rounded" `}
            />

            {/* DATE + TIME */}
            <div className="col-span-2 text-sm space-y-2">
              <div className="flex items-center gap-1">
                <span
                  className={
                    order.status === "Pending"
                      ? "text-orange-500"
                      : "text-green-600"
                  }
                >
                  {order.id}
                </span>
                <span
                  className={
                    order.status === "Pending"
                      ? "text-orange-500"
                      : "text-green-600"
                  }
                >
                  {order.type}
                </span>
              </div>
              <div className="flex items-center text-red-500 text-xs gap-1">
                <Clock size={14} />
                {order.time}
              </div>
              <div className="flex items-center text-xs text-gray-500 gap-1">
                <CalendarDays size={14} />
                {order.date}
              </div>
            </div>

            {/* STATUS */}
            <div className="col-span-2 text-sm space-y-2">
              <div
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  order.status === "Pending"
                    ? "bg-yellow-300 text-yellow-900"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {order.status}
              </div>
              <div className="text-xs text-gray-500">POS {order.pos}</div>
            </div>

            {/* TOTAL */}
            <div className="col-span-2 text-sm font-semibold space-y-2">
              <div className="inline-block px-2 py-1 bg-orange-400 text-white rounded-full text-xs font-bold">
                Unpaid
              </div>
              <div>Rs {order.total.toFixed(2)}</div>
            </div>

            {/* CLIENT */}
            <div className="col-span-3 text-sm ">
              <div className="flex items-center text-xs text-gray-500 gap-1">
                <User2 size={14} />
                {order.client}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="col-span-3 flex justify-end items-center gap-2 text-sm">
              <Button
                variant="outline"
                className="border text-red-600 border-red-600 hover:bg-red-50"
              >
                <X size={14} /> Cancel
              </Button>

              {order.status !== "Pending" && (
                <>
                  <Button variant="outline">
                    <Printer size={14} />
                  </Button>
                  <Button variant="outline">Status</Button>
                </>
              )}

              <Button
                variant="outline"
                className="border text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <DollarSign size={14} /> Pay
              </Button>

              <Button
                className={`text-white ${
                  order.status === "Pending" ? "bg-gray-400" : "bg-blue-600"
                }`}
                onClick={() => setOpen(open)}
              >
                <Check size={14} />{" "}
                {order.status === "Pending" ? "Accept" : "Finish"}
              </Button>

              {order.status !== "Pending" && (
                <MoreVertical
                  size={18}
                  className="cursor-pointer text-gray-500"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
