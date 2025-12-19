// app/api/orders/[id]/status/route.ts
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

  // 3️⃣ Verify restaurant ownership
  const { data: restaurant, error: restError } = await supabase
    .from("restaurants")
    .select("id")
    .eq("id", restaurantId)
    .eq("owner_id", user.id)
    .single();

  if (restError || !restaurant) {
    return NextResponse.json(
      { error: "Not authorized for this restaurant" },
      { status: 403 }
    );
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
      { error: "Order not found or not authorized" },
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
