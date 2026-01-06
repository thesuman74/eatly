import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { categoryId, restaurantId } = body;

    if (!categoryId || !restaurantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch role + assignment
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, restaurant_id, max_restaurant")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userData) {
      return new NextResponse(JSON.stringify({ error: "Access denied" }), {
        status: 403,
      });
    }

    // . Permission check
    if (
      !can({
        role: userData.role,
        permission: Permission.DUPLICATE_CATEGORY,
      })
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Insufficient permissions" }),
        {
          status: 403,
        }
      );
    }

    // Verify restaurant ownership once
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json(
        { error: "Not authorized for this restaurant" },
        { status: 403 }
      );
    }

    // Fetch the original category (RLS ensures user can only access their categories)
    const { data: category, error: fetchError } = await supabase
      .from("categories")
      .select("*")
      .eq("id", categoryId)
      .single();

    if (fetchError || !category)
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );

    // Duplicate category including restaurant_id
    const { data: newCategory, error: insertError } = await supabase
      .from("categories")
      .insert([
        {
          name: category.name + " Copy",
          slug: null,
          isVisible: category.isVisible,
          restaurant_id: restaurant.id, // RLS uses this for row-level security
        },
      ])
      .select()
      .single();

    if (insertError || !newCategory) throw insertError;

    // Fetch original products (RLS ensures user can only access their products)
    const { data: originalProducts, error: prodFetchError } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id);

    if (prodFetchError)
      console.error(
        "Error fetching original products:",
        prodFetchError.message
      );

    // Duplicate products including restaurant_id
    const productsToInsert =
      originalProducts && originalProducts.length > 0
        ? originalProducts.map((p) => ({
            name: p.name,
            price: p.price,
            description: p.description || "",
            category_id: newCategory.id,
            restaurant_id: restaurant.id, // important for RLS
          }))
        : [
            {
              name: "Item 1",
              price: 0,
              category_id: newCategory.id,
              restaurant_id: restaurant.id,
            },
          ];

    const { data: newProducts, error: prodInsertError } = await supabase
      .from("products")
      .insert(productsToInsert)
      .select("*");

    if (prodInsertError)
      console.error("Error duplicating products:", prodInsertError.message);

    return NextResponse.json({
      success: true,
      message: "Category duplicated successfully",
      category: { ...newCategory, products: newProducts || [] },
    });
  } catch (error: unknown) {
    console.error("Error duplicating category:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
