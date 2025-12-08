import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const supabase = await createClient();

  const { product_id, name, price, description, category_id } =
    await req.json();

  if (!product_id || !name || !price || !description || !category_id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data: updatedProduct, error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      category_id,
    })
    .eq("id", product_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      product: updatedProduct,
      message: "Product updated successfully",
      success: true,
    },
    { status: 200 }
  );
}
