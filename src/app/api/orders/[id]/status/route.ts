// app/api/orders/[id]/status/route.ts
import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";
import { UserRoles } from "@/lib/rbac/roles";
import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUS } from "@/lib/types/order-types";
import { NextResponse } from "next/server";
import { z } from "zod";

// 1️⃣ Validation schema
const statusSchema = z.object({
  status: z.enum(Object.values(ORDER_STATUS) as [string, ...string[]]),
  restaurantId: z.string(),
});

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

  // 1️⃣ Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2️⃣ Parse and validate body
  const body = await req.json();
  const parseResult = statusSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.message },
      { status: 400 }
    );
  }

  const { status, restaurantId } = parseResult.data;

  if (status === ORDER_STATUS.CANCELLED) {
    return NextResponse.json(
      { error: "Please use the cancel endpoint" },
      { status: 400 }
    );
  }

  // 2. Fetch role + assignment
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role, restaurant_id")
    .eq("id", user.id)
    .maybeSingle();

  if (userError || !userData) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // 3. Permission check
  if (
    !can({
      role: userData.role,
      permission: Permission.UPDATE_ORDER_STATUS,
    })
  ) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  // 4. Role-based scoping
  let query = supabase.from("restaurants").select("*").eq("id", restaurantId);

  if (userData.role === UserRoles.OWNER) {
    query = query.eq("owner_id", user.id);
  } else {
    if (userData.restaurant_id !== restaurantId) {
      return NextResponse.json(
        { error: "Resource access denied" },
        { status: 403 }
      );
    }
  }

  const { data: restaurant, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  // 4️⃣ Update order (scoped!)
  const { data: updatedOrder, error: updateError } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .eq("restaurant_id", restaurantId)
    .select()
    .single();

  if (updateError || !updatedOrder) {
    return NextResponse.json(
      { error: updateError || "Order not found or not authorized" },
      { status: 400 }
    );
  }
  // 5️⃣ Insert status log
  const { error: logError } = await supabase.from("order_status_logs").insert({
    order_id: orderId,
    status,
    restaurant_id: restaurantId,
  });

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 400 });
  }

  // 5️⃣ Return updated order
  return NextResponse.json(updatedOrder);
}
