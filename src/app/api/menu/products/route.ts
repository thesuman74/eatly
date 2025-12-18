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

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { name, price, description, category_id } = await req.json();

    // Basic validation
    if (
      !name?.trim() ||
      price == null ||
      !description?.trim() ||
      !category_id
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify category exists and belongs to a restaurant owned by user
    const { data: category, error: catError } = await supabase
      .from("categories")
      .select("id, restaurant_id")
      .eq("id", category_id)
      .single();

    if (catError || !category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Extra ownership check (RLS also enforces this)
    const { data: restaurant, error: restError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", category.restaurant_id)
      .eq("owner_id", user?.id)
      .single();

    if (restError || !restaurant) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Insert new product
    const { data: newProduct, error: insertError } = await supabase
      .from("products")
      .insert([
        {
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          category_id,
          restaurant_id: category.restaurant_id,
        },
      ])
      .select()
      .single();

    if (insertError || !newProduct) {
      return NextResponse.json(
        { error: insertError?.message || "Failed to create product" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (err: any) {
    console.error("Error adding product:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
