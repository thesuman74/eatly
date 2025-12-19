// src/app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { CreateOrderPayload, PAYMENT_STATUS } from "@/lib/types/order-types";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id: orderId } = await context.params;

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  const body: CreateOrderPayload = await req.json();
  const { order, items, payment } = body;

  try {
    // 1️⃣ Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Verify restaurant ownership
    if (!order.restaurant_id) {
      return NextResponse.json(
        { error: "restaurant_id is required" },
        { status: 400 }
      );
    }

    const { data: restaurant, error: restError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", order.restaurant_id)
      .eq("owner_id", user.id)
      .single();

    if (restError || !restaurant) {
      return NextResponse.json(
        { error: "Not authorized for this restaurant" },
        { status: 403 }
      );
    }

    const hasItemsUpdate = Array.isArray(items) && items.length > 0;

    const { data: existingOrder, error: existingError } = await supabase
      .from("orders")
      .select("subtotal, total")
      .eq("id", orderId)
      .single();

    if (existingError || !existingOrder) {
      throw new Error("Order not found");
    }

    // 1️⃣ Update order metadata
    let subtotal = existingOrder.subtotal;
    let total = existingOrder.total;

    if (hasItemsUpdate) {
      subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
      total = subtotal + (payment?.tip ?? 0);
    }

    const paymentStatus =
      payment?.amount_paid && payment.amount_paid > 0
        ? PAYMENT_STATUS.PAID
        : PAYMENT_STATUS.UNPAID;

    const { data: updatedOrder, error: orderError } = await supabase
      .from("orders")
      .update({
        customer_name: order.customer_name ?? null,
        notes: order.notes ?? null,
        order_type: order.order_type ?? null,
        payment_status: paymentStatus ?? null,
        subtotal,
        total,
      })
      .eq("id", orderId)
      .select()
      .single();

    if (orderError || !updatedOrder) {
      throw new Error(orderError?.message || "Order update failed");
    }

    // 2️⃣ Update order items
    // For simplicity, remove all previous items and insert new ones
    await supabase
      .from("order_items")
      .delete()
      .eq("order_id", orderId)
      .eq("restaurant_id", order.restaurant_id);

    const itemsPayload = items.map((i) => ({
      order_id: orderId,
      product_id: i.product_id,
      quantity: i.quantity,
      unit_price: i.unit_price,
      total_price: i.total_price,
      notes: i.notes ?? null,
      restaurant_id: order.restaurant_id ?? null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsPayload);

    if (itemsError) throw new Error(itemsError.message);

    // 3️⃣ Upsert payment if provided
    if (payment) {
      const { error: paymentError } = await supabase
        .from("order_payments")
        .upsert({
          order_id: orderId,
          method: payment.method,
          amount_paid: payment.amount_paid,
          tip: payment.tip,
          change_returned: payment.change_returned,
        });
      if (paymentError) throw new Error(paymentError.message);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
