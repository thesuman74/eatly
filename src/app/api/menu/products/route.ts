// app/api/menu/products/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";

// used src\app\api\menu\structured\route.ts for get method

// export async function GET(req: Request) {
//   const supabase = await createClient();

//   try {
//     const { searchParams } = new URL(req.url);
//     const categoryId = searchParams.get("categoryId");
//     const restaurantId = searchParams.get("restaurantId");

//     if (!categoryId) {
//       return NextResponse.json(
//         { error: "Missing required categoryId" },
//         { status: 400 }
//       );
//     }

//     // 1. Authenticate
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return NextResponse.json(
//         { error: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     // 2. Fetch role + assignment
//     const { data: userData, error: userError } = await supabase
//       .from("users")
//       .select("role, restaurant_id")
//       .eq("id", user.id)
//       .maybeSingle();

//     if (userError || !userData) {
//       return NextResponse.json({ error: "Access denied" }, { status: 403 });
//     }

//     // 3. Permission check
//     if (
//       !can({
//         role: userData.role,
//         permission: Permission.READ_PRODUCT_INFO,
//       })
//     ) {
//       return NextResponse.json(
//         { error: "Insufficient permissions" },
//         { status: 403 }
//       );
//     }

//     // Verify ownership
//     const { data: restaurant, error: restaurantError } = await supabase
//       .from("restaurants")
//       .select("id, owner_id")
//       .eq("id", restaurantId)
//       .eq("owner_id", user.id)
//       .single();

//     if (restaurantError || !restaurant) {
//       return NextResponse.json(
//         { error: "Not authorized for this restaurant" },
//         { status: 403 }
//       );
//     }

//     const { data: products, error } = await supabase
//       .from("products")
//       .select("*, images:product_images(*)")
//       .eq("category_id", categoryId);

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json({ products });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error("Error fetching products:", error.message);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//     console.error("Unknown error fetching products:", error);
//     return NextResponse.json(
//       { error: "An unknown error occurred" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { name, price, description, category_id, restaurantId } =
      await req.json();

    // Basic validation
    if (
      !name?.trim() ||
      price == null ||
      !description?.trim() ||
      !category_id ||
      !restaurantId
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
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

    // 2. Fetch role + assignment
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, restaurant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 3. Permission check
    if (
      !can({
        role: userData.role,
        permission: Permission.CREATE_PRODUCT,
      })
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Verify that restaurantId belongs to the user
    const { data: restaurant, error: restError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .single();

    if (restError || !restaurant) {
      return NextResponse.json(
        { error: "Not authorized for this restaurant" },
        { status: 403 }
      );
    }

    // Verify that category belongs to this restaurant
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

    if (category.restaurant_id !== restaurantId) {
      return NextResponse.json(
        { error: "Category does not belong to this restaurant" },
        { status: 400 }
      );
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
          restaurant_id: restaurantId,
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

export async function PATCH(req: Request) {
  const supabase = await createClient();

  try {
    const { product_id, name, price, description, category_id, restaurantId } =
      await req.json();

    if (
      !product_id ||
      !name?.trim() ||
      price == null ||
      !description?.trim() ||
      !category_id ||
      !restaurantId
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
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

    // 2. Fetch role + assignment
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, restaurant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 3. Permission check
    if (
      !can({
        role: userData.role,
        permission: Permission.UPDATE_PRODUCT,
      })
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Verify product exists and belongs to restaurant owned by user
    const { data: product, error: prodError } = await supabase
      .from("products")
      .select("id, category_id, restaurant_id")
      .eq("id", product_id)
      .eq("restaurant_id", restaurantId)
      .single();
    if (prodError || !product) {
      return NextResponse.json(
        { error: "Not authorized for this product" },
        { status: 403 }
      );
    }

    // Verify category belongs to the same restaurant
    const { data: category, error: catError } = await supabase
      .from("categories")
      .select("id, restaurant_id")
      .eq("id", category_id)
      .eq("restaurant_id", restaurantId)
      .single();
    if (catError || !category) {
      return NextResponse.json(
        { error: "Invalid category for this restaurant" },
        { status: 403 }
      );
    }

    // Update product
    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category_id,
      })
      .eq("id", product_id)
      .select()
      .single();

    if (updateError || !updatedProduct) {
      return NextResponse.json(
        { error: updateError?.message || "Failed to update product" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err: any) {
    console.error("Error updating product:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const supabase = await createClient();

  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");
    const restaurantId = url.searchParams.get("restaurantId"); // pass via query param

    if (!productId) {
      return NextResponse.json(
        { error: "Missing required productId" },
        { status: 400 }
      );
    }

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Missing required restaurantId" },
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

    // 2. Fetch role + assignment
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, restaurant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 3. Permission check
    if (
      !can({
        role: userData.role,
        permission: Permission.DELETE_PRODUCT,
      })
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }
    // Verify restaurant ownership
    const { data: restaurant, error: restError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .single();

    if (restError || !restaurant) {
      return NextResponse.json(
        { error: "Not authorized for this restaurant" },
        { status: 403 }
      );
    }

    // Verify product belongs to this restaurant
    const { data: product, error: prodError } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .eq("restaurant_id", restaurantId)
      .single();

    if (prodError || !product) {
      return NextResponse.json(
        { error: "Product not found or not in this restaurant" },
        { status: 404 }
      );
    }

    // Delete product
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
