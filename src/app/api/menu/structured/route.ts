import { NextResponse } from "next/server";
import { getCategoriesFromDB } from "@/services/server/ServerCategoryServices";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    console.log("structured api req", req);
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    console.log("restaurantId from routes", restaurantId);

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("position", { ascending: true });

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("restaurant_id", restaurantId)
      .order("position", { ascending: true });

    if (categoriesError || productsError) {
      throw new Error(categoriesError?.message || productsError?.message);
    }

    // Optional: structure products under categories
    const structured = categories.map((cat) => ({
      ...cat,
      products: products.filter((p) => p.category_id === cat.id),
    }));

    return NextResponse.json(structured);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
