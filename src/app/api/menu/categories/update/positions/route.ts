import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const { updates } = await req.json();

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid updates array" },
        { status: 400 }
      );
    }

    // Loop through each update and update only the position
    for (const update of updates) {
      const { error } = await supabase
        .from("categories")
        .update({ position: update.position })
        .eq("id", update.id);

      if (error) {
        console.error("Failed to update category:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json(
      { success: true, message: "Positions updated successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to update category positions:", error);
    return NextResponse.json(
      { error: "Failed to update category positions" },
      { status: 500 }
    );
  }
}
