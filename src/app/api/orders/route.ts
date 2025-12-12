// app/api/orders/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const url = new URL(req.url);
  const statusFilter = url.searchParams.get("status");

  // 1️⃣ Fetch orders with optional status
  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data: orders, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  // 2️⃣ Compute total for each order (items + addons + tip)
  const orderIds = orders.map((o) => o.id);

  // fetch items
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  // fetch addons
  const itemIds = items?.map((i) => i.id) || [];
  const { data: addons } = await supabase
    .from("order_item_addons")
    .select("*")
    .in("order_item_id", itemIds);

  // fetch payments (to include tip)
  const { data: payments } = await supabase
    .from("order_payments")
    .select("*")
    .in("order_id", orderIds);

  // map total amount for each order
  const ordersWithTotals = orders.map((order) => {
    const orderItems = items?.filter((i) => i.order_id === order.id) || [];
    const orderAddons = addons || [];
    const orderPayments =
      payments?.filter((p) => p.order_id === order.id) || [];

    const itemsTotal = orderItems.reduce((acc, item) => {
      const addonTotal = orderAddons
        .filter((a) => a.order_item_id === item.id)
        .reduce((a, b) => a + b.price * b.quantity, 0);
      return acc + item.unit_price * item.quantity + addonTotal;
    }, 0);

    const tipsTotal = orderPayments.reduce((acc, p) => acc + (p.tip || 0), 0);

    return {
      id: order.id,
      customer_name: order.customer_name,
      order_type: order.order_type,
      status: order.status,
      payment_status: order.payment_status,
      created_at: order.created_at,
      total_amount: itemsTotal + tipsTotal,
    };
  });

  return NextResponse.json(ordersWithTotals);
}
