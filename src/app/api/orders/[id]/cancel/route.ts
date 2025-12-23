import { createClient } from "@/lib/supabase/server";
import {
  ORDER_CANCEL_REASONS,
  ORDER_STATUS,
  PAYMENT_STATUS,
} from "@/lib/types/order-types";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  // 1. Validation
  const cancelOrderSchema = z.object({
    orderId: z.string().uuid(),
    restaurantId: z.string().uuid(),
    cancelled_reason: z.enum(Object.values(ORDER_CANCEL_REASONS)), // dynamic from enum

    cancel_note: z.string().optional(),
    // role: z.enum(["customer", "manager", "staff", "kitchen", "admin"]),
  });
  let validated;
  try {
    const body = await req.json();
    validated = cancelOrderSchema.parse(body);
  } catch (err: any) {
    // simple custom message
    return NextResponse.json(
      {
        error:
          "Invalid input. Please check order ID, restaurant ID, and cancellation reason.",
      },
      { status: 400 }
    );
  }

  const { orderId, restaurantId, cancelled_reason, cancel_note } = validated;

  try {
    const supabase = await createClient();

    // 2. Authorize user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Verify restaurant ownership if needed
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (restaurantError || !restaurant) {
      return NextResponse.json(
        { error: "You are not authorized for this restaurant" },
        { status: 401 }
      );
    }

    // 4. Fetch order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 5. Check if cancellable
    const nonCancellableStatuses = [
      ORDER_STATUS.CANCELLED,
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.COMPLETED,
      ORDER_STATUS.READY,
    ];

    if (nonCancellableStatuses.includes(order.status)) {
      return NextResponse.json(
        {
          error: `Order cannot be cancelled because it is already ${order.status}`,
        },
        { status: 400 }
      );
    }

    // 6. Fetch payment status
    const { data: paymentData, error: paymentError } = await supabase
      .from("order_payments")
      .select("*")
      .eq("order_id", orderId);

    if (paymentError) {
      return NextResponse.json(
        { error: "Cannot fetch payment status", paymentError },
        { status: 400 }
      );
    }

    console.log("paymentData", paymentData);
    // Compute net payment
    const netPayment =
      paymentData?.reduce((acc, p) => acc + (p.amount_paid || 0), 0) || 0;

    // Check if order has been paid (any positive net amount)
    const isPaid = netPayment > 0;

    if (isPaid) {
      return NextResponse.json(
        { error: "Please refund before cancelling" },
        { status: 400 }
      );
    }

    // 7. Update order and logs (simulate transaction)
    const { error: updateOrderError } = await supabase
      .from("orders")
      .update({
        status: ORDER_STATUS.CANCELLED,
        cancelled_at: new Date().toISOString(),
        // cancelled_by: userId,
        // cancelled_by_role: role,
        cancelled_reason,
        cancelled_note: cancel_note || null,
      })
      .eq("id", orderId);

    if (updateOrderError) {
      return NextResponse.json(
        { error: "Failed to cancel order" },
        { status: 500 }
      );
    }

    // Insert into order_status_logs
    const { error: logError } = await supabase
      .from("order_status_logs")
      .insert({
        order_id: orderId,
        restaurant_id: restaurantId,
        status: ORDER_STATUS.CANCELLED,
        created_at: new Date().toISOString(),
      });

    if (logError) {
      return NextResponse.json(
        { error: "Failed to log order status" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, order_id: orderId },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
