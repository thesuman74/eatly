import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const supabase = await createClient();

  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Missing required productId" },
        { status: 400 }
      );
    }

    // Fetch current product
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id, isVisible")
      .eq("id", productId)
      .single();

    if (fetchError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Toggle visibility
    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update({ isVisible: !product.isVisible })
      .eq("id", productId)
      .select("*")
      .single();

    if (updateError || !updatedProduct) {
      return NextResponse.json(
        { error: updateError?.message || "Failed to update product" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Product visibility toggled`,
      product: updatedProduct,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error toggling product visibility:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Unknown error toggling product visibility:", error);
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
