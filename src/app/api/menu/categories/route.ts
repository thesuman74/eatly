import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";

export async function POST(req: Request) {
  //   Category Insert Flow with RLS:

  // Client sends request with restaurant_id.

  // Authenticate user → get user.id.
  //fetch roles and assign
  // verify permissions -> only owner can create categories

  // Verify ownership → ensure restaurant_id belongs to owner_id = user.id.

  // Insert category using verified restaurant_id.

  // RLS validates row-level security conditions. --> category.owner_id = user.id and category.restaurant_id = restaurant_id

  try {
    // Parse request body
    const body = await req.json();

    const { restaurantId } = body;

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId is required" },
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
        permission: Permission.CREATE_CATEGORY,
      })
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Insufficient permissions" }),
        {
          status: 403,
        }
      );
    }

    // Verify ownership
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id, owner_id")
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .single();

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

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const { updates, restaurantId } = await req.json();

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId is required" },
        { status: 400 }
      );
    }

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid updates array" },
        { status: 400 }
      );
    }

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
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json(
        { error: "Not authorized for this restaurant" },
        { status: 403 }
      );
    }

    const results = [];

    for (const update of updates) {
      const { id, name, position, isVisible } = update;

      // Build object only with fields that exist
      const fieldsToUpdate: Record<string, any> = {};
      if (name !== undefined) fieldsToUpdate.name = name;
      if (position !== undefined) fieldsToUpdate.position = position;
      if (isVisible !== undefined) fieldsToUpdate.isVisible = isVisible;

      if (Object.keys(fieldsToUpdate).length === 0) continue;

      // Update category (RLS ensures ownership)
      const { data, error } = await supabase
        .from("categories")
        .update(fieldsToUpdate)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Failed to update category:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      results.push(data);
    }

    return NextResponse.json(
      { success: true, updated: results },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update categories:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const supabase = await createClient();

  // Get categoryId from query params
  const url = new URL(req.url);
  const categoryId = url.searchParams.get("categoryId");

  if (!categoryId) {
    return NextResponse.json(
      { error: "Missing required categoryId" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { restaurantId } = body;

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId is required" },
        { status: 400 }
      );
    }

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
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json(
        { error: "Not authorized for this restaurant" },
        { status: 403 }
      );
    }

    // Get all products in the category
    const { data: products } = await supabase
      .from("products")
      .select("id")
      .eq("category_id", categoryId);

    const productIds = products?.map((p) => p.id) || [];

    // Check if any products are in active orders
    if (productIds.length > 0) {
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("id")
        .in("product_id", productIds);

      if (orderItems && orderItems?.length > 0) {
        return NextResponse.json(
          {
            error: "Cannot delete category: some products are in active orders",
          },
          { status: 400 }
        );
      }

      // Delete products
      const { error: productDeleteError } = await supabase
        .from("products")
        .delete()
        .in("id", productIds);

      if (productDeleteError) throw productDeleteError;
    }

    // Delete category
    const { error: categoryDeleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (categoryDeleteError) throw categoryDeleteError;

    return NextResponse.json({
      success: true,
      message: "Category and its products deleted successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting category:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Unknown error deleting category:", error);
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
