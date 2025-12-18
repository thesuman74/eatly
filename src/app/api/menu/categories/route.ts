import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  //   Category Insert Flow with RLS:

  // Client sends request with restaurant_id.

  // Authenticate user → get user.id.

  // Verify ownership → ensure restaurant_id belongs to owner_id = user.id.

  // Insert category using verified restaurant_id.

  // RLS validates row-level security conditions. --> category.owner_id = user.id and category.restaurant_id = restaurant_id

  try {
    // Parse request body
    const body = await req.json();
    console.log("body", body);
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    // console.log("token", token);

    const { restaurant_id } = body;

    if (!restaurant_id) {
      return NextResponse.json(
        { error: "restaurant_id is required" },
        { status: 400 }
      );
    }
    const supabase = await createClient();

    // Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id, owner_id")
      .eq("id", restaurant_id)
      .eq("owner_id", user.id)
      .single();

    // auth.id vs owner id
    console.log("auth.id vs owner id ", user.id, "vs", restaurant?.owner_id);
    console.log(
      "user sent resturantId vs db",
      restaurant_id,
      "vs",
      restaurant?.id
    );
    const id_match = user.id === restaurant?.owner_id;
    console.log("id_match", id_match);

    if (restaurantError || !restaurant) {
      return NextResponse.json(
        { error: "Not authorized for this restaurant" },
        { status: 403 }
      );
    }

    // Step 1: Insert category using verified restaurant_id
    const { data: newCategory, error: categoryError } = await supabase
      .from("categories")
      .insert([{ name: "New category", restaurant_id: restaurant.id }])
      .select()
      .single();

    if (categoryError || !newCategory) {
      return NextResponse.json(
        { error: "Failed to create category", details: categoryError?.message },
        { status: 500 }
      );
    }

    // Step 2: Insert default product linked to the new category
    const { data: newProduct, error: productError } = await supabase
      .from("products")
      .insert([
        {
          name: "Product 1",
          price: 0,
          category_id: newCategory.id,
          restaurant_id: restaurant.id,
        },
      ])
      .select()
      .single();

    if (productError || !newProduct) {
      return NextResponse.json(
        {
          error: "Category created but failed to create product",
          details: productError?.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Default category and product created",
      category: newCategory,
      product: newProduct,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
