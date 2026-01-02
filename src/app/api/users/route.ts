import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const restaurantId = url.searchParams.get("restaurantId");

  if (!restaurantId) {
    return NextResponse.json(
      { error: "Restaurant ID is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();

    // Authenticate requesting user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify restaurant ownership
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .single();

    if (!restaurant) {
      return NextResponse.json(
        { error: "You are not authorized for this restaurant" },
        { status: 401 }
      );
    }
    if (restaurantError) {
      return NextResponse.json(
        {
          error: "Restaurant ownership check failed",
          details: restaurantError,
        },
        { status: 500 }
      );
    }

    // Fetch users with info from auth.users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select(
        `
        id,
        role,
        restaurant_id,
        created_at,
        auth_user:auth_users!inner(id, email, phone, raw_user_meta_data)
      `
      )
      .eq("restaurant_id", restaurantId);

    if (usersError) {
      return NextResponse.json(
        { error: "Failed to fetch users", details: usersError },
        { status: 500 }
      );
    }

    // Format users with email and name from auth_user
    const formattedUsers = users.map((u: any) => ({
      id: u.id,
      role: u.role,
      restaurant_id: u.restaurant_id,
      created_at: u.created_at,
      email: u.auth_user.email,
      phone: u.auth_user.phone,
      name: u.auth_user.raw_user_meta_data?.full_name || "",
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, phone, role, restaurantId, name } = body;

    if (!email || !password || !phone || !role || !restaurantId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Authenticate requesting user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify restaurant ownership
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .single();

    if (!restaurant) {
      return NextResponse.json(
        { error: "You are not authorized for this restaurant" },
        { status: 401 }
      );
    }

    if (restaurantError) {
      return NextResponse.json(
        {
          error: "Restaurant ownership check failed",
          details: restaurantError,
        },
        { status: 500 }
      );
    }

    // Create new auth user
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          full_name: name,
          phone,
        },
      });

    if (authError) {
      return NextResponse.json(
        { error: "Failed to create auth user", details: authError },
        { status: 500 }
      );
    }

    // Insert user into your users table
    const { data: userRecord, error: userInsertError } = await supabase
      .from("users")
      .insert({
        id: authUser.user.id, // match auth_user_id with auth.users.id
        role,
        restaurant_id: restaurantId,
      })
      .single();

    if (userInsertError) {
      return NextResponse.json(
        {
          error: "Failed to insert user into users table",
          details: userInsertError,
        },
        { status: 500 }
      );
    }

    // Return created user info
    return NextResponse.json({
      user: {
        id: authUser.user.id,
        email: authUser.user.email,
        name,
        role,
        restaurant_id: restaurantId,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error", details: error },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, role, name, phone, restaurantId } = body;

    if (!userId || !restaurantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Authenticate requesting user
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify restaurant ownership
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .eq("owner_id", authUser.id)
      .single();

    if (!restaurant) {
      return NextResponse.json(
        { error: "You are not authorized for this restaurant" },
        { status: 401 }
      );
    }

    if (restaurantError) {
      return NextResponse.json(
        { error: "Restaurant check failed", details: restaurantError },
        { status: 500 }
      );
    }

    // Update user role in users table
    if (role) {
      const { error: roleError } = await supabase
        .from("users")
        .update({ role })
        .eq("id", userId)
        .eq("restaurant_id", restaurantId);

      if (roleError) {
        return NextResponse.json(
          { error: "Failed to update role", details: roleError },
          { status: 500 }
        );
      }
    }

    // Update name or phone in auth metadata
    if (name || phone) {
      const { data: updatedUser, error: updateAuthError } =
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: {
            ...(name && { full_name: name }),
            ...(phone && { phone }),
          },
        });

      if (updateAuthError) {
        return NextResponse.json(
          { error: "Failed to update auth metadata", details: updateAuthError },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const restaurantId = url.searchParams.get("restaurantId");

    if (!userId || !restaurantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Authenticate requesting user
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify restaurant ownership
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .eq("owner_id", authUser.id)
      .single();

    if (!restaurant) {
      return NextResponse.json(
        { error: "You are not authorized for this restaurant" },
        { status: 401 }
      );
    }

    if (restaurantError) {
      return NextResponse.json(
        { error: "Restaurant check failed", details: restaurantError },
        { status: 500 }
      );
    }

    // Delete from users table first
    const { error: userTableError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId)
      .eq("restaurant_id", restaurantId);

    if (userTableError) {
      return NextResponse.json(
        { error: "Failed to delete user record", details: userTableError },
        { status: 500 }
      );
    }

    // Delete from auth.users
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(
      userId
    );
    if (authDeleteError) {
      return NextResponse.json(
        { error: "Failed to delete auth user", details: authDeleteError },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error", details: error },
      { status: 500 }
    );
  }
}
