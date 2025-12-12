import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const body = await req.json();

  const { order, items, payment } = body;

  // 1. insert order

  const { data: newOrder, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_type: order.order_type,
      customer_name: order.customer_name,
      title: order.title,
      payment_status: order.payment_status,
      status: order.status,
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }
  // STEP 2: Insert order items
  const itemsPayload = items.map((item: any) => ({
    order_id: newOrder.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    notes: item.notes,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsPayload);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 400 });
  }
  // STEP 3: Insert payment info
  const { error: paymentError } = await supabase.from("order_payments").insert({
    order_id: newOrder.id,
    method: payment.method,
    amount_paid: payment.amount_received,
    tip: payment.tip,
    change_returned: payment.change_returned,
  });

  if (paymentError) {
    return NextResponse.json({ error: paymentError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, order_id: newOrder.id });
}
