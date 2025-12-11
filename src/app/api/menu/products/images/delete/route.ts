import { createClient } from "@/lib/supabase/server";
import { stat } from "fs";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const supabase = await createClient();

  const { image_id } = await req.json();

  if (!image_id) {
    return NextResponse.json(
      { error: "Missing required image_id" },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", image_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { error: "Failed to delete product image" },
      { status: 500 }
    );
  }
}
