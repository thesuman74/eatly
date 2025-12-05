import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
  try {
    const { categoryId, name } = await req.json();

    if (!categoryId || !name) {
      return NextResponse.json(
        { success: false, error: "categoryId and name are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: updatedCategory, error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", categoryId)
      .select()
      .single();

    if (error || !updatedCategory) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || "Failed to update category name",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category name updated successfully",
      category: updatedCategory,
    });
  } catch (err: any) {
    console.error("Error updating category name:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
