import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const body = await req.json();
    const extractedMenu = body.reviewMenuData;
    console.log("extractedMenu", extractedMenu);

    if (!Array.isArray(extractedMenu)) {
      return NextResponse.json(
        { error: "Invalid menu format" },
        { status: 400 }
      );
    }

    const results: any[] = [];

    for (const category of extractedMenu) {
      // 1️⃣ Insert category
      const { data: newCategory, error: catError } = await supabase
        .from("categories")
        .insert({
          name: category.name,
        })
        .select()
        .single();

      if (catError) throw catError;

      const categoryResult = {
        category: newCategory,
        products: [] as any[],
      }; // 2️⃣ Insert each product under this category
      for (const product of category.products) {
        const { data: newProduct, error: prodError } = await supabase
          .from("products")
          .insert({
            name: product.name,
            description: product.description ?? "",
            price: product.price ?? 0,
            category_id: newCategory.id,
          })
          .select()
          .single();

        if (prodError) throw prodError;

        // 3️⃣ Store product image (1 per extracted item)
        // if (product.image?.url) {
        //   const { error: imgError } = await supabase
        //     .from("product_images")
        //     .insert({
        //       product_id: newProduct.id,
        //       image_url: product.image.url,
        //       alt: product.image.alt ?? "",
        //     });

        //   if (imgError) throw imgError;
        // }

        categoryResult.products.push(newProduct);
      }

      results.push(categoryResult);
    }
    return NextResponse.json({
      message: "Menu imported successfully",
      results,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to import menu" },
      { status: 500 }
    );
  }
}
