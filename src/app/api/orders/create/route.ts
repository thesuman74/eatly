// src/app/api/orders/create/route.ts
import { createClient } from "@/lib/supabase/server";
import { CreateOrderPayload } from "@/lib/types/order-types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const body: CreateOrderPayload = await req.json();
  console.log("body in api/orders/create", body);

  const { order, items, payment } = body;

  try {
    // 1. Insert order
    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const total = subtotal + (payment.tip || 0);

    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: order.customer_name,
        payment_status: order.payment_status || "unpaid",
        status: "pending",
        order_type: order.order_type,
        subtotal,
        total,
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      throw new Error("Order insertion failed: " + orderError?.message);
    }

    // 2. Insert order items
    const itemsPayload = items.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      notes: item.notes || null,
      total_price: item.total_price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsPayload);

    if (itemsError) {
      throw new Error("Order items insertion failed: " + itemsError.message);
    }

    // 3. Insert payment info
    const { error: paymentError } = await supabase
      .from("order_payments")
      .insert({
        order_id: newOrder.id,
        method: payment.method,
        amount_paid: payment.amount_paid,
        tip: payment.tip,
        change_returned: payment.change_returned,
      });

    if (paymentError) {
      throw new Error("Payment insertion failed: " + paymentError.message);
    }

    return NextResponse.json({ success: true, order_id: newOrder.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
