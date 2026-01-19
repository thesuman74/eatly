import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";
import { UserRoles } from "@/lib/rbac/roles";
import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/types/order-types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orderId, restaurantId } = body;

  if (!orderId || !restaurantId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
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

    // 2️⃣ Fetch role + assignment
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, restaurant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 3️⃣ Permission check
    if (
      !can({
        role: userData.role,
        permission: Permission.REFUND_ORDER_PAYMENT,
      })
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // 4️⃣ Role-based scoping
    let query = supabase.from("restaurants").select("*").eq("id", restaurantId);

    if (userData.role === UserRoles.OWNER) {
      query = query.eq("owner_id", user.id);
    } else {
      if (userData.restaurant_id !== restaurantId) {
        return NextResponse.json(
          { error: "Resource access denied" },
          { status: 403 },
        );
      }
    }

    const { data: restaurant, error } = await query.maybeSingle();
    if (error) throw new Error(error.message);

    // 5️⃣ Fetch all payments for the order
    const { data: payments, error: paymentsError } = await supabase
      .from("order_payments")
      .select("amount_paid, payment_status")
      .eq("order_id", orderId);

    if (paymentsError || !payments || payments.length === 0) {
      return NextResponse.json(
        { error: "Payment not found for this order" },
        { status: 404 },
      );
    }

    // ✅ Only allow refund if payment_status is PAID
    const paidAmount = payments
      .filter((p) => p.payment_status === PAYMENT_STATUS.PAID)
      .reduce((sum, p) => sum + p.amount_paid, 0);

    if (paidAmount <= 0) {
      return NextResponse.json(
        { error: "Only fully paid orders can be refunded" },
        { status: 400 },
      );
    }

    // 6️⃣ Fetch the order to check status
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ✅ Only allow refund if order status is DRAFT or ACCEPTED
    if (![ORDER_STATUS.DRAFT, ORDER_STATUS.ACCEPTED].includes(order.status)) {
      return NextResponse.json(
        {
          error: `Cannot refund because order is already ${order.status.toUpperCase()}`,
        },
        { status: 400 },
      );
    }

    // 7️⃣ Insert refund as a new row (append-only)
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
        { status: 400 },
      );
    }

    // 8️⃣ Success response
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
      { status: 500 },
    );
  }
}
