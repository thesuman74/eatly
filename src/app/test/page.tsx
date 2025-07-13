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
import CounterTable from "@/components/order/CounterTable";
import OrderTabsSection from "@/components/order/TabsSection";
export default function Home() {
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
      <div className="w-full">
        <OrderTabsSection />
      </div>
      {/* <CounterTable /> */}
    </>
  );
}
