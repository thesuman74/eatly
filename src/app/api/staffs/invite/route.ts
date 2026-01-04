import { createClient } from "@/lib/supabase/server";
import { serverService } from "@/lib/supabase/serverService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, role, restaurantId } = await req.json();

    if (!email || !role || !restaurantId) {
      return NextResponse.json(
        { error: "Email, role, and restaurantId are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Owner verification
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .single();

    if (!restaurant) {
      return NextResponse.json(
        { error: "You are not authorized for this restaurant" },
        { status: 403 }
      );
    }

    // Prevent duplicate active invites
    const { data: existingInvite } = await supabase
      .from("staff_invites")
      .select("id")
      .eq("email", email)
      .eq("restaurant_id", restaurantId)
      .eq("invite_status", "pending")
      .maybeSingle();

    if (existingInvite) {
      return NextResponse.json(
        { error: "An active invite already exists for this email" },
        { status: 409 }
      );
    }

    await serverService.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding/staff`,
    });

    // Save invite
    const { error: inviteInsertError } = await supabase
      .from("staff_invites")
      .insert({
        email,
        role,
        restaurant_id: restaurantId,
        invited_by: user.id,
        invite_status: "pending",
      });

    if (inviteInsertError) {
      return NextResponse.json(
        { error: "Failed to create invite" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Invite sent successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
