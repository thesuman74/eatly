import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { full_name, phone, password } = await req.json();

    if (!full_name || !phone || !password) {
      return NextResponse.json(
        { error: "Full name, phone, and password are required" },
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

    // Fetch pending invite for this user's email
    const { data: invite } = await supabase
      .from("staff_invites")
      .select("*")
      .eq("email", user.email)
      .eq("invite_status", "pending")
      .maybeSingle();

    if (!invite) {
      return NextResponse.json(
        { error: "No pending invite found for this user" },
        { status: 404 }
      );
    }

    // Update auth user metadata (full name, phone, password)
    const { error: updateError } = await supabase.auth.updateUser({
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

    // Insert into users table using restaurantId and role from invite
    const { error: insertError } = await supabase.from("users").insert({
      id: user.id,
      role: invite.role,
      restaurant_id: invite.restaurant_id,
      status: "active",
    });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to insert staff", details: insertError },
        { status: 500 }
      );
    }

    // Mark invite as accepted
    await supabase
      .from("staff_invites")
      .update({
        invite_status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", invite.id);

    return NextResponse.json({ message: "Signup completed successfully" });
  } catch (err) {
    console.error("Complete Signup Error:", err);
    return NextResponse.json(
      { error: "Unexpected server error", details: err },
      { status: 500 }
    );
  }
}
