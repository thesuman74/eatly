import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

//todo: i am not using this yet, please check if this is safe and necessary before using ,

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const restaurantId = url.searchParams.get("restaurantId");

    if (!restaurantId)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    // 2. Fetch role + assignment
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, restaurant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 3. Permission check
    if (
      !can({
        role: userData.role,
        permission: Permission.CREATE_STAFF_INVITE,
      })
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { data: roles, error: rolesError } = await supabase.rpc(
      "get_user_roles"
    );

    if (rolesError) {
      return NextResponse.json(
        { error: "Failed to fetch roles" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      roles,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
