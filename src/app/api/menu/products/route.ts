// app/api/menu/products/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();

  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    console.log("categoryId from routes", categoryId);

    if (!categoryId) {
      return NextResponse.json(
        { error: "Missing required categoryId" },
        { status: 400 }
      );
    }

    const { data: products, error } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("category_id", categoryId);

    console.log("get products api", products);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching products:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Unknown error fetching products:", error);
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
