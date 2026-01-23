import { getImageForProduct } from "@/lib/subscription/getImageForProducts";
import { createClient } from "@/lib/supabase/server";
import { ProductTypes } from "@/lib/types/menu-types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    // Parse JSON body
    const body = await req.json();
    const { restaurantId, reviewMenuData } = body;

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId is required" },
        { status: 400 },
      );
    }

    if (!Array.isArray(reviewMenuData)) {
      return NextResponse.json(
        { error: "Invalid menu format" },
        { status: 400 },
      );
    }

    // 1️⃣ Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2️⃣ Verify restaurant ownership
    const { data: restaurant, error: restError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .single();

    if (restError || !restaurant) {
      return NextResponse.json(
        { error: "Not authorized for this restaurant" },
        { status: 403 },
      );
    }

    const results: any[] = [];

    // 3️⃣ Insert categories & products
    for (const category of reviewMenuData) {
      // Insert category
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

      // Insert all products in parallel with Promise.all
      const insertedProducts = await Promise.all(
        (category.products as ProductTypes[]).map(
          async (product: ProductTypes) => {
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

            if (prodError || !newProduct) {
              throw prodError;
            }

            const imageUrl = await getImageForProduct(product.name);

            // // 🔹 Log result clearly
            // if (imageUrl) {
            //   console.log(
            //     `[IMPORT][IMAGE FOUND] "${product.name}" → ${imageUrl}`,
            //   );
            // } else {
            //   console.log(`[IMPORT][NO IMAGE] "${product.name}"`);
            // }

            // 🔹 Insert image ONLY if URL exists
            if (imageUrl) {
              const { error: imgError } = await supabase
                .from("product_images")
                .insert({
                  product_id: newProduct.id,
                  url: imageUrl,
                  alt: `${product.name} Image`,
                  sort_order: 0,
                  is_primary: true,
                });

              if (imgError) {
                console.error("Failed to insert product image:", imgError);
              }
            }

            return newProduct;
          },
        ),
      );

      categoryResult.products.push(...insertedProducts);
      results.push(categoryResult);
    }

    return NextResponse.json({
      message: "Menu with images imported successfully",
      results,
      success: true,
    });
  } catch (error: any) {
    console.error("Failed to import menu with images:", error);
    return NextResponse.json(
      { error: error.message || "Failed to import menu" },
      { status: 500 },
    );
  }
}
