// app/api/orders/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const orderId = params.id;

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  // 1️⃣ Fetch order metadata
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // 2️⃣ Fetch order items
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  // 3️⃣ Fetch addons for each item
  const itemIds = items?.map((i) => i.id) || [];
  const { data: addons } = await supabase
    .from("order_item_addons")
    .select("*")
    .in("order_item_id", itemIds);

  // attach addons to items
  const itemsWithAddons =
    items?.map((item) => ({
      ...item,
      addons: addons?.filter((a) => a.order_item_id === item.id) || [],
    })) || [];

  // 4️⃣ Fetch payments
  const { data: payments } = await supabase
    .from("order_payments")
    .select("*")
    .eq("order_id", orderId);

  // 5️⃣ Fetch status logs (optional)
  const { data: status_logs } = await supabase
    .from("order_status_logs")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  // 6️⃣ Return structured response
  return NextResponse.json({
    ...order,
    items: itemsWithAddons,
    payments: payments || [],
    status_logs: status_logs || [],
  });
}
