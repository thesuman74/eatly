// app/api/orders/[id]/status/route.ts
import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUS } from "@/lib/types/order-types";
import { NextResponse } from "next/server";
import { z } from "zod";

// 1️⃣ Validation schema
const statusSchema = z.object({
  status: z.enum(Object.values(ORDER_STATUS) as [string, ...string[]]),
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

  // 2️⃣ Parse and validate body
  const body = await req.json();
  const parseResult = statusSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.message },
      { status: 400 }
    );
  }

  const { status } = parseResult.data;

  // 3️⃣ Update order status
  const { data: updatedOrder, error: updateError } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (updateError || !updatedOrder) {
    return NextResponse.json(
      { error: updateError?.message || "Order not found" },
      { status: 400 }
    );
  }

  // 4️⃣ Insert status log
  const { error: logError } = await supabase.from("order_status_logs").insert({
    order_id: orderId,
    status,
  });

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 400 });
  }

  // 5️⃣ Return updated order
  return NextResponse.json(updatedOrder);
}
