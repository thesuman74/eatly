import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const itemId = params.id;

  if (!itemId) {
    return NextResponse.json(
      { error: "Order item ID is required" },
      { status: 400 }
    );
  }

  const { error: deleteError } = await supabase
    .from("order_items")
    .delete()
    .eq("id", itemId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
