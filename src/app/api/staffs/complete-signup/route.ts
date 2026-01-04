import { createClient } from "@/lib/supabase/server";
import { STAFFROLES } from "@/lib/types/staff-types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { full_name, phone, password, restaurantId } = await req.json();

    if (!full_name || !phone || !password || !restaurantId) {
      return NextResponse.json(
        { error: "Full name, phone, password, and restaurantId are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the currently logged-in user (after magic link)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update auth user metadata
    const { data: updatedUser, error: updateError } =
      await supabase.auth.updateUser({
        password,
        data: {
          full_name,
          phone,
        },
      });

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update user info", details: updateError },
        { status: 500 }
      );
    }

    // Insert into users table with active status
    const { error: insertError } = await supabase.from("users").insert({
      id: user.id, // match auth.users
      role: STAFFROLES.STAFF, // assign role
      restaurant_id: restaurantId,
      status: "active",
    });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to insert staff", details: insertError },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Signup completed successfully" });
  } catch (err) {
    console.error("Complete Signup Error:", err);
    return NextResponse.json(
      { error: "Unexpected server error", details: err },
      { status: 500 }
    );
  }
}
