// app/api/menu/categories/add/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  // Step 1: Create a new category with default name
  const { data: newCategory, error: categoryError } = await supabase
    .from("categories")
    .insert([{ name: "New category" }])
    .select()
    .single();

  // console.log("newCategory", newCategory);
  // console.log("categoryError", categoryError);

  if (categoryError || !newCategory) {
    return NextResponse.json(
      { error: "Failed to create category", details: categoryError?.message },
      { status: 500 }
    );
  }

  // Step 2: Create a default product linked to the new category
  const { data: newProduct, error: productError } = await supabase
    .from("products")
    .insert([
      {
        name: "Item 1",
        price: 0,
        category_id: newCategory.id,
      },
    ])
    .select()
    .single();

  // console.log("newProduct", newProduct);
  // console.log("productError", productError);

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
    message: "Default Category and  product created",
    category: newCategory,
    product: newProduct,
  });
}
