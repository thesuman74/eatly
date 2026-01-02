// File: /app/api/staff/invite/route.ts
import { createClient } from "@/lib/supabase/server";
import { serverService } from "@/lib/supabase/serverService";
import { url } from "inspector";
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

    // Authenticate requesting admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin owns the restaurant
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json(
        { error: "You are not authorized for this restaurant" },
        { status: 403 }
      );
    }

    // Invite user via magic link
    const { data: invitedUser, error: inviteError } =
      await serverService.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/staff/complete-signup`,
      });

    if (inviteError) {
      // Check for email already exists
      if (inviteError.code === "email_exists") {
        return NextResponse.json(
          {
            error:
              "This email is already registered. Try logging in or using another email.",
          },
          { status: 422 }
        );
      }
    }

    // Optionally, insert a pending staff record in your users table
    const { error: insertError } = await supabase.from("users").insert({
      email,
      role,
      restaurant_id: restaurantId,
      status: "pending", // mark as invited
    });

    if (insertError) {
      console.warn("Failed to insert pending staff:", insertError);
    }

    return NextResponse.json({
      message: "Invite sent successfully",
      invitedUser,
    });
  } catch (err) {
    console.error("Invite Staff Error:", err);
    return NextResponse.json(
      { error: "Unexpected server error", details: err },
      { status: 500 }
    );
  }
}
