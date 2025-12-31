import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Missing required productId" },
        { status: 400 }
      );
    }

    // Get logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch original product with category and restaurant
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("*, category_id, categories(restaurant_id)")
      .eq("id", productId)
      .single();
    if (fetchError || !product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // Verify ownership via restaurant
    const { data: restaurant, error: restError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", product.categories.restaurant_id)
      .eq("owner_id", user.id)
      .single();
    if (restError || !restaurant)
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    // 1️⃣ Duplicate the product
    const { data: newProduct, error: insertError } = await supabase
      .from("products")
      .insert([
        {
          name: product.name + " Copy",
          description: product.description || "",
          price: product.price,
          category_id: product.category_id,
          restaurant_id: product.categories.restaurant_id,
          isVisible: product.isVisible,
        },
      ])
      .select("*")
      .single();
    if (insertError || !newProduct)
      return NextResponse.json(
        { error: insertError?.message || "Failed to duplicate product" },
        { status: 500 }
      );

    // 2️⃣ Duplicate images
    const { data: images } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .eq("restaurant_id", product.categories.restaurant_id);

    if (images && images.length > 0) {
      const newImages = images.map((img) => ({
        product_id: newProduct.id,
        url: img.url,
        alt: img.alt || img.name || "",
        sort_order: img.sort_order || 0,
        is_primary: img.is_primary || false,
      }));

      const { error: insertImagesError } = await supabase
        .from("product_images")
        .insert(newImages);

      if (insertImagesError)
        console.error("Failed to duplicate images:", insertImagesError);
    }

    return NextResponse.json({
      success: true,
      message: "Product duplicated successfully",
      product: newProduct,
    });
  } catch (err: any) {
    console.error("Error duplicating product:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
