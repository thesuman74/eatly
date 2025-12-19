import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const body = await req.json();
    const { restaurantId, reviewMenuData } = body;

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(reviewMenuData)) {
      return NextResponse.json(
        { error: "Invalid menu format" },
        { status: 400 }
      );
    }

    // 1️⃣ Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Verify that user owns the restaurant
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

    const results: any[] = [];

    for (const category of reviewMenuData) {
      // 3️⃣ Insert category with restaurant_id
      const { data: newCategory, error: catError } = await supabase
        .from("categories")
        .insert({
          name: category.name,
          restaurant_id: restaurant.id,
        })
        .select()
        .single();

      if (catError || !newCategory) throw catError;

      const categoryResult = { category: newCategory, products: [] as any[] };

      // 4️⃣ Insert each product under this category
      for (const product of category.products) {
        const { data: newProduct, error: prodError } = await supabase
          .from("products")
          .insert({
            name: product.name,
            description: product.description ?? "",
            price: product.price ?? 0,
            category_id: newCategory.id,
            restaurant_id: restaurant.id,
            isVisible: product.isVisible ?? true,
          })
          .select()
          .single();

        if (prodError || !newProduct) throw prodError;

        // 5️⃣ Insert product images (if any)
        if (Array.isArray(product.images) && product.images.length > 0) {
          const newImages = product.images.map((img: any, index: number) => ({
            product_id: newProduct.id,
            url: img.url,
            alt: img.alt ?? "",
            sort_order: index,
            is_primary: index === 0,
          }));

          const { error: imgError } = await supabase
            .from("product_images")
            .insert(newImages);

          if (imgError) console.error("Failed to insert images:", imgError);
        }

        categoryResult.products.push(newProduct);
      }

      results.push(categoryResult);
    }

    return NextResponse.json({
      message: "Menu imported successfully",
      results,
      success: true,
    });
  } catch (error: any) {
    console.error("Failed to import menu:", error);
    return NextResponse.json(
      { error: error.message || "Failed to import menu" },
      { status: 500 }
    );
  }
}
