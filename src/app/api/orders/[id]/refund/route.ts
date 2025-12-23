import { createClient } from "@/lib/supabase/server";
import { PAYMENT_STATUS } from "@/lib/types/order-types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orderId, restaurantId } = body;

  if (!orderId || !restaurantId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();

    // 1️⃣ Authenticate
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Verify ownership
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json(
        { error: "Not authorized for this restaurant" },
        { status: 403 }
      );
    }

    // 3️⃣ Fetch all payments for the order
    const { data: payments, error: paymentsError } = await supabase
      .from("order_payments")
      .select("amount_paid")
      .eq("order_id", orderId);

    if (paymentsError || !payments || payments.length === 0) {
      return NextResponse.json(
        { error: "Payment not found for this order" },
        { status: 404 }
      );
    }

    // 4️⃣ Calculate refundable amount
    const paidAmount = payments.reduce((sum, p) => sum + p.amount_paid, 0);

    if (paidAmount <= 0) {
      return NextResponse.json(
        { error: "Only paid orders can be refunded" },
        { status: 400 }
      );
    }

    // 5️⃣ Insert refund as a new row (append-only)
    const { error: paymentRefundError } = await supabase
      .from("order_payments")
      .insert({
        order_id: orderId,
        restaurant_id: restaurantId,
        method: "refund",
        amount_paid: -paidAmount, // negative ledger entry
        tip: 0,
        change_returned: 0,
        payment_status: PAYMENT_STATUS.REFUNDED,
      });

    if (paymentRefundError) {
      return NextResponse.json(
        { error: paymentRefundError.message },
        { status: 400 }
      );
    }

    // 6️⃣ Success response
    return NextResponse.json({
      success: true,
      orderId,
      refunded_amount: paidAmount,
      payment_status: PAYMENT_STATUS.REFUNDED,
    });
  } catch (error: any) {
    console.error("Error refunding order:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
