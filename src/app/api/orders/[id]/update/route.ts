import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateQuantitySchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id: itemId } = await context.params;

  console.log("order item id ", itemId);

  if (!itemId) {
    return NextResponse.json(
      { error: "Order item ID is required" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parseResult = updateQuantitySchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.message },
      { status: 400 }
    );
  }

  const { quantity } = parseResult.data;

  // ✅ First, fetch unit_price from DB
  const { data: existingItem, error: fetchError } = await supabase
    .from("order_items")
    .select("unit_price")
    .eq("id", itemId)
    .single();

  if (fetchError || !existingItem) {
    return NextResponse.json(
      { error: fetchError?.message || "Item not found" },
      { status: 400 }
    );
  }

  const total_price = existingItem.unit_price * quantity;

  // ✅ Update with calculated total_price
  const { data: updatedItem, error: updateError } = await supabase
    .from("order_items")
    .update({
      quantity,
      total_price,
    })
    .eq("id", itemId)
    .select()
    .single();

  if (updateError || !updatedItem) {
    return NextResponse.json(
      { error: updateError?.message || "Failed to update item" },
      { status: 400 }
    );
  }

  return NextResponse.json(updatedItem);
}
