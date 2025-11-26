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
          slug: null, // optional, generate new slug if needed
          position: category.position, // or adjust if you want it at the end
          isVisible: category.isVisible,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      message: "Category duplicated successfully",
      category: newCategory,
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
