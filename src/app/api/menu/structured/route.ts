import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .order("position", { ascending: true });

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .order("position", { ascending: true });

  console.log("categories", categories);
  console.log("products", products);

  if (categoriesError || productsError) {
    return NextResponse.json(
      { error: categoriesError?.message || productsError?.message },
      { status: 500 }
    );
  }

  const structured = categories.map((cat) => ({
    ...cat,
    products: products.filter((p) => p.category_id === cat.id),
  }));

  return NextResponse.json(structured, { status: 200 });
}
