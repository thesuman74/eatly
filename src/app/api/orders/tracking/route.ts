import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json(
      { error: "Missing required orderId" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();

    // requiements
    // from orders table
    // 1. status --> draft preparing delivered
    // order type
    // restaurant id

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("status, order_type, restaurant_id, customer_name")
      .eq("id", orderId);

    if (!orderData) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (orderError) {
      return NextResponse.json({ error: orderError }, { status: 400 });
    }

    console.log("data", orderData);

    // from order_items
    // quantity + unit price + total

    const { data: orderItems, error: orderItemsError } = await supabase
      .from("order_items")
      //   .select("quantity, unit_price, total_price")
      .select("*,product:product_id(*)")
      .eq("order_id", orderId);

    if (!orderItems && orderItemsError) {
      return NextResponse.json({ error: orderItemsError }, { status: 400 });
    }

    console.log("orderItems", orderItems);

    // from order_payments
    // payment status

    const { data: paymentData, error: paymentError } = await supabase
      .from("order_payments")
      .select("*")
      .eq("order_id", orderId);

    if (!paymentData && paymentError) {
      return NextResponse.json({ error: paymentError }, { status: 400 });
    }

    console.log("paymentData", paymentData);

    return NextResponse.json(
      { orderData, orderItems, paymentData },
      { status: 200 }
    );
  } catch (error) {}
}
