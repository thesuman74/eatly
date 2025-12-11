import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const { categoryId } = await req.json();

    if (!categoryId) {
      return NextResponse.json(
        { error: "Missing required categoryId" },
        { status: 400 }
      );
    }

    // Fetch the original category
    const { data: category, error: fetchError } = await supabase
      .from("categories")
      .select("*")
      .eq("id", categoryId)
      .single();

    if (fetchError || !category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Create a duplicate category
    const { data: newCategory, error: insertError } = await supabase
      .from("categories")
      .insert([
        {
          name: category.name + " Copy",
          slug: null,
          position: category.position,
          isVisible: category.isVisible,
        },
      ])
      .select()
      .single();

    if (insertError || !newCategory) throw insertError;

    // Fetch original products
    const { data: originalProducts, error: prodFetchError } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id);

    if (prodFetchError) {
      console.error(
        "Error fetching original products:",
        prodFetchError.message
      );
    }

    let newProducts: any[] = [];

    // Duplicate products
    if (originalProducts && originalProducts.length > 0) {
      const productsToInsert = originalProducts.map((p) => ({
        name: p.name,
        price: p.price,
        description: p.description || "",
        category_id: newCategory.id,
      }));

      const { data: insertedProducts, error: prodInsertError } = await supabase
        .from("products")
        .insert(productsToInsert)
        .select("*");

      if (prodInsertError) {
        console.error("Error duplicating products:", prodInsertError.message);
      } else {
        newProducts = insertedProducts || [];
      }
    } else {
      // Create default product if none exist
      const { data: defaultProduct } = await supabase
        .from("products")
        .insert([{ name: "Item 1", price: 0, category_id: newCategory.id }])
        .select("*");

      newProducts = defaultProduct || [];
    }

    // Return new category including products
    return NextResponse.json({
      success: true,
      message: "Category duplicated successfully",
      category: { ...newCategory, products: newProducts },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error duplicating category:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Unknown error duplicating category:", error);
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
