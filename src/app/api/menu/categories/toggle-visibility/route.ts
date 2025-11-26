import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const supabase = await createClient();

  try {
    const { categoryId } = await req.json();

    if (!categoryId) {
      return NextResponse.json(
        { error: "Missing required categoryId" },
        { status: 400 }
      );
    }

    // Fetch the current category
    const { data: category, error: fetchError } = await supabase
      .from("categories")
      .select("id, isVisible")
      .eq("id", categoryId)
      .single();

    if (fetchError || !category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Toggle the visibility
    const { data: updatedCategory, error: updateError } = await supabase
      .from("categories")
      .update({ isVisible: !category.isVisible })
      .eq("id", categoryId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: "Visibility toggled",
      category: updatedCategory,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error toggling visibility:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Unknown error toggling visibility:", error);
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
