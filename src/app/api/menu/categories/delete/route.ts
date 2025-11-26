import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const supabase = await createClient();

  // Get categoryId from query params
  const url = new URL(req.url);
  const categoryId = url.searchParams.get("categoryId");

  console.log("categoryId", categoryId);

  if (!categoryId) {
    return NextResponse.json(
      { error: "Missing required categoryId" },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting category:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // fallback for non-Error objects
    console.error("Unknown error deleting category:", error);
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
