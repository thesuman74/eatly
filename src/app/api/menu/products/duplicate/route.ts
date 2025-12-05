import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Missing required productId" },
        { status: 400 }
      );
    }

    // Fetch the original product
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (fetchError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Duplicate the product
    const { data: newProduct, error: insertError } = await supabase
      .from("products")
      .insert([
        {
          name: product.name + " Copy",
          description: product.description || "",
          price: product.price,
          category_id: product.category_id,
          // Add other fields if needed, like isVisible, image, etc.
        },
      ])
      .select("*")
      .single();

    if (insertError || !newProduct) {
      return NextResponse.json(
        { error: insertError?.message || "Failed to duplicate product" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product duplicated successfully",
      product: newProduct,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error duplicating product:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Unknown error duplicating product:", error);
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
