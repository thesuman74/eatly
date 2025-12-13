// app/api/orders/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
console.log("HIT [id] ROUTE");

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await context.params;
  const supabase = await createClient();

  // console.log("orderId", orderId);

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

  // console.log("order", order);

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // 2️⃣ Fetch order items
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  // console.log("items", items);

  // 2️⃣ Get product IDs
  const productIds = items?.map((i) => i.product_id) || [];

  // 3️⃣ Fetch product details
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select(`*, product_images(*)`)
    .in("id", productIds);

  if (productsError) {
    console.error("Error fetching products:", productsError);
  }

  // ✅ Ensure products is always an array
  const products: typeof productsData = productsData || [];

  // 4️⃣ Merge items with product info
  const itemsWithDetails = items?.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.product_id) || null, // fallback to null
  }));

  console.log(" itemsWithDetails", itemsWithDetails);

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

  // console.log("itemsWithAddons", itemsWithAddons);

  // 4️⃣ Fetch payments
  const { data: payments } = await supabase
    .from("order_payments")
    .select("*")
    .eq("order_id", orderId);

  // console.log("payments", payments);

  // 5️⃣ Fetch status logs (optional)
  const { data: status_logs } = await supabase
    .from("order_status_logs")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  // 6️⃣ Return structured response
  return NextResponse.json({
    ...order,
    items: itemsWithDetails || [],
    payments: payments || [],
    status_logs: status_logs || [],
  });
}
