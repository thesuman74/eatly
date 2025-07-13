"use client";

import {
  Check,
  CheckCheck,
  Cross,
  DollarSign,
  Eye,
  Filter,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
export default function CounterTable() {
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
  ];

  return (
    <>
      <main className="flex flex-col bg-white shadow-md p-2">
        <section className="flex w-full justify-between rounded-sm  px-8 py-2 items-center">
          {/* <!-- filter section  --> */}
          <div className="flex items-center gap-4">
            <Filter />
            <div className="w-fit rounded-full border p-1 px-4 flex gap-2 bg-blue-100 text-blue-600">
              <Check />
              <span>All</span>
            </div>
            <div className="w-fit rounded-full border border-input px-4 p-1 flex gap-1">
              <span>Pending</span>
              <span className="rounded-full bg-orange-400 text-white font-bold w-6 h-6 flex items-center justify-center text-xs">
                1
              </span>
            </div>
            <div className="w-fit rounded-full border px-4 p-1 flex gap-1">
              <span>On Going</span>
              <span className="rounded-full text-white font-bold bg-green-400 w-6 h-6 flex items-center justify-center text-xs">
                1
              </span>
            </div>
          </div>

          {/* total price  */}

          <div className="flex gap-1">
            <span className="text-gray-500">Total:</span>
            <span>Rs</span>
            <span>1000</span>
            <span className="ml-2">
              <Eye />
            </span>
          </div>
        </section>

        {/* tables section  */}

        <section>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader className="border text-gray-500 bg-gray-100">
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Client</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className="text-right">
                    {invoice.totalAmount}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-4">
                      <Button
                        variant={"outline"}
                        className="text-red-500 border-red-500"
                      >
                        <span className="cursor-pointer">
                          <X />
                        </span>
                        <span>Cancel</span>
                      </Button>

                      <Button
                        variant={"outline"}
                        className="text-blue-500 border-blue-500"
                      >
                        <span className="cursor-pointer">$</span>
                        <span>Pay</span>
                      </Button>

                      <Button
                        variant={"default"}
                        className="text-white bg-green-500"
                      >
                        <span className="cursor-pointer">
                          <Check />
                        </span>
                        <span>Confirm</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </section>
      </main>
    </>
  );
}
