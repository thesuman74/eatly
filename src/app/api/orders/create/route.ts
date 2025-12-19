// src/app/api/orders/create/route.ts
import { createClient } from "@/lib/supabase/server";
import { CreateOrderPayload, PAYMENT_STATUS } from "@/lib/types/order-types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body: CreateOrderPayload = await req.json();
  const { order, items, payment } = body;

  console.log("body", body);

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

    // 3️⃣ Calculate amounts safely
    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const tip = payment?.tip ?? 0;
    const total = subtotal + tip;

    const paymentStatus =
      payment?.amount_paid && payment.amount_paid > 0
        ? PAYMENT_STATUS.PAID
        : PAYMENT_STATUS.UNPAID;

    // 4️⃣ Insert order with verified restaurant_id
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: order.customer_name ?? null,
        payment_status: paymentStatus,
        order_type: order.order_type ?? null,
        subtotal,
        total,
        notes: order.notes ?? null,
        restaurant_id: restaurant.id, // ✅ must include
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      throw new Error(orderError?.message || "Order insertion failed");
    }

    // 5️⃣ Insert order items
    const itemsPayload = items.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      notes: item.notes ?? null,
      restaurant_id: order.restaurant_id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsPayload);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    // 6️⃣ Insert payment ONLY if paid
    if (payment) {
      const { error: paymentError } = await supabase
        .from("order_payments")
        .insert({
          order_id: newOrder.id,
          method: payment.method,
          amount_paid: payment.amount_paid,
          tip: payment.tip ?? 0,
          change_returned: payment.change_returned ?? 0,
          restaurant_id: order.restaurant_id,
        });

      if (paymentError) {
        throw new Error(paymentError.message);
      }
    }

    return NextResponse.json({
      success: true,
      order_id: newOrder.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
