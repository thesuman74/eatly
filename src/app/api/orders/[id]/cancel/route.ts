import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";
import { UserRoles } from "@/lib/rbac/roles";
import { createClient } from "@/lib/supabase/server";
import {
  ORDER_CANCEL_REASONS,
  ORDER_STATUS,
  PAYMENT_STATUS,
} from "@/lib/types/order-types";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1️⃣ Input validation
    const cancelOrderSchema = z.object({
      orderId: z.string().uuid(),
      restaurantId: z.string().uuid(),
      cancelled_reason: z.enum(Object.values(ORDER_CANCEL_REASONS)),
      cancel_note: z.string().optional(),
    });

    let validated;
    try {
      const body = await req.json();
      validated = cancelOrderSchema.parse(body);
    } catch (err) {
      return NextResponse.json(
        {
          error:
            "Invalid input. Please check order ID, restaurant ID, and cancellation reason.",
        },
        { status: 400 }
      );
    }

    const { orderId, restaurantId, cancelled_reason, cancel_note } = validated;

    // 2️⃣ Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3️⃣ Fetch user role + restaurant assignment
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, restaurant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 4️⃣ Permission check
    if (
      !can({
        role: userData.role,
        permission: Permission.CANCEL_ORDER,
      })
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // 5️⃣ Fetch order (server source of truth)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 6️⃣ Multi-tenant & ownership check
    // Owner: can cancel any of their restaurants
    // Staff: can cancel only their assigned restaurant
    let restaurantQuery = supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId);

    if (userData.role === UserRoles.OWNER) {
      restaurantQuery = restaurantQuery.eq("owner_id", user.id);
    } else {
      if (userData.restaurant_id !== restaurantId) {
        return NextResponse.json(
          { error: "Not authorized for this restaurant" },
          { status: 403 }
        );
      }
    }

    const { data: restaurant, error: restError } =
      await restaurantQuery.single();

    if (restError || !restaurant) {
      return NextResponse.json(
        { error: "You are not authorized for this restaurant" },
        { status: 403 }
      );
    }

    // 7️⃣ Validate order belongs to restaurant
    if (order.restaurant_id !== restaurantId) {
      return NextResponse.json(
        { error: "Order does not belong to this restaurant" },
        { status: 403 }
      );
    }

    // 8️⃣ Check if order status allows cancellation
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

    // 9️⃣ Check payment status
    const { data: paymentData } = await supabase
      .from("order_payments")
      .select("*")
      .eq("order_id", orderId);

    // Determine payment_status based on actual payment records
    let payment_status: "unpaid" | "paid" | "refunded" = "unpaid";

    if (paymentData && paymentData.length > 0) {
      // check if any refund exists
      if (
        paymentData.some((p) => p.payment_status === PAYMENT_STATUS.REFUNDED)
      ) {
        payment_status = PAYMENT_STATUS.REFUNDED;
      } else if (
        paymentData.some((p) => p.payment_status === PAYMENT_STATUS.PAID)
      ) {
        payment_status = PAYMENT_STATUS.PAID;
      }
    }
    if (payment_status === PAYMENT_STATUS.PAID) {
      return NextResponse.json(
        { error: "Please refund before cancelling" },
        { status: 400 }
      );
    }

    // 1️⃣0️⃣ Cancel order
    const { error: updateOrderError } = await supabase
      .from("orders")
      .update({
        status: ORDER_STATUS.CANCELLED,
        cancelled_at: new Date().toISOString(),
        cancelled_by: user.id,
        cancelled_by_role: userData.role,
        cancelled_reason,
        cancelled_note: cancel_note ?? null,
      })
      .eq("id", orderId)
      .eq("restaurant_id", restaurantId);

    if (updateOrderError) {
      return NextResponse.json(
        { error: updateOrderError.message || "Failed to cancel order" },
        { status: 500 }
      );
    }

    // 1️⃣1️⃣ Log order status
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
        { error: logError.message || "Failed to log order status" },
        { status: 500 }
      );
    }

    // 1️⃣2️⃣ Return success
    return NextResponse.json({ success: true, id: orderId }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
