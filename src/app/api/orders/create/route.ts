// src/app/api/orders/create/route.ts
import { createClient } from "@/lib/supabase/server";
import { CreateOrderPayload, PAYMENT_STATUS } from "@/lib/types/order-types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const body: CreateOrderPayload = await req.json();
  const { order, items, payment } = body;

  console.log("order body", body);

  try {
    // 1. Calculate amounts safely
    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
    const tip = payment?.tip ?? 0;
    const total = subtotal + tip;

    // 2. Validate payment rules
    if (order.payment_status === PAYMENT_STATUS.PAID && !payment) {
      throw new Error("Paid order must include payment details");
    }

    // if (payment && order.payment_status !== PAYMENT_STATUS.PAID) {
    //   throw new Error("Payment provided for unpaid order");
    // }
    const paymentStatus =
      payment?.amount_paid && payment.amount_paid > 0
        ? PAYMENT_STATUS.PAID
        : PAYMENT_STATUS.UNPAID;
    // 3. Insert order
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: order.customer_name ?? null,
        payment_status: paymentStatus,
        order_type: order.order_type ?? null,
        subtotal,
        total,
        notes: order.notes ?? null,
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      throw new Error(orderError?.message || "Order insertion failed");
    }

    // 4. Insert order items
    const itemsPayload = items.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      notes: item.notes ?? null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsPayload);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    // 5. Insert payment ONLY if paid
    if (payment) {
      const { error: paymentError } = await supabase
        .from("order_payments")
        .insert({
          order_id: newOrder.id,
          method: payment.method,
          amount_paid: payment.amount_paid,
          tip: payment.tip ?? 0,
          change_returned: payment.change_returned ?? 0,
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
