import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";
import { UserRoles } from "@/lib/rbac/roles";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const RESTAURANT_TYPES = ["restaurant", "bar", "cafe", "other"];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const restaurantId = url.searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Missing restaurantId" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Authenticate
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
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
        permission: Permission.READ_RESTAURANT_INFO,
      })
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // 4. Role-based scoping
    let query = supabase.from("restaurants").select("*").eq("id", restaurantId);

    if (userData.role === UserRoles.OWNER) {
      query = query.eq("owner_id", user.id);
    } else {
      if (userData.restaurant_id !== restaurantId) {
        return NextResponse.json(
          { error: "Resource access denied" },
          { status: 403 }
        );
      }
    }

    const { data: restaurant, error } = await query.maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(restaurant);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    // Get current authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Parse request body
    const body = await req.json();
    const { restaurantName, type } = body;

    if (!restaurantName || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    if (!RESTAURANT_TYPES.includes(type)) {
      return new Response(
        JSON.stringify({ error: "Invalid restaurant type" }),
        {
          status: 400,
        }
      );
    }

    // 1. Check if user exists in `users` table
    let { data: existingUser, error: userFetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userFetchError && userFetchError.code !== "PGRST116") {
      // PGRST116 = row not found
      return new Response(JSON.stringify({ error: userFetchError.message }), {
        status: 500,
      });
    }

    // 2. Insert user if not exists
    if (!existingUser) {
      const { data: newUser, error: userInsertError } = await supabase
        .from("users")
        .insert({
          id: user.id,
          role: "owner",
          max_restaurant: 1,
        })
        .select()
        .single();

      if (userInsertError || !newUser) {
        return new Response(
          JSON.stringify({
            error: userInsertError?.message || "Failed to create user",
          }),
          { status: 500 }
        );
      }

      existingUser = newUser;
    }

    const maxRestaurant = existingUser.max_restaurant ?? 1;

    // 3. Count current restaurants
    const { count: currentCount, error: countError } = await supabase
      .from("restaurants")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", user.id);

    if (countError) {
      return new Response(JSON.stringify({ error: countError.message }), {
        status: 500,
      });
    }

    if ((currentCount ?? 0) >= maxRestaurant) {
      return new Response(
        JSON.stringify({ error: "You have reached your restaurant limit" }),
        { status: 403 }
      );
    }

    // 3. Insert new restaurant
    const { data: newRestaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .insert({
        name: restaurantName,
        type,
        owner_id: user.id,
      })
      .select()
      .single(); // Get the first (and only) inserted row

    if (restaurantError || !newRestaurant) {
      return new Response(
        JSON.stringify({
          error: restaurantError?.message || "Failed to create restaurant",
        }),
        { status: 500 }
      );
    }

    // 4. Update users table with restaurantId
    const { data: updatedUser, error: userUpdateError } = await supabase
      .from("users")
      .update({
        restaurant_id: newRestaurant.id,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (userUpdateError) {
      return new Response(JSON.stringify({ error: userUpdateError.message }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({ restaurant: newRestaurant, user: updatedUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Server error" }),
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const supabase = await createClient();
    const url = new URL(req.url);
    const restaurantId = url.searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        {
          status: 400,
        }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: userData } = await supabase
      .from("users")
      .select("role, restaurant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!userData)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Permission check
    if (
      !can({ role: userData.role, permission: Permission.UPDATE_RESTAURANT })
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // Optionally, allow only owner to update logo/banner/name

    const allowedFields: string[] = ["name", "logo_url", "banner_url"];
    const updates: Record<string, any> = {};

    allowedFields.forEach((field) => {
      if (body[field as keyof typeof body] !== undefined) {
        updates[field] = body[field as keyof typeof body];
      }
    });

    const { data, error } = await supabase
      .from("restaurants")
      .update(updates)
      .eq("id", restaurantId);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const supabase = await createClient();

  const url = new URL(req.url);
  const restaurantId = url.searchParams.get("restaurantId");

  try {
    // Get current authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    if (!restaurantId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    // Delete restaurant
    const { error: deleteError } = await supabase
      .from("restaurants")
      .delete()
      .eq("id", restaurantId)
      .eq("owner_id", user.id);

    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
