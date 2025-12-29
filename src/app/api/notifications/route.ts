import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    //Authroize user

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        error: "Unauthorized",
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const limit = Number(searchParams.get("limit") ?? 20);

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Missing required restaurantId" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("restaurant_id", restaurantId)
      // .eq("user_id", user.id)
      .limit(limit)
      .order("created_at", { ascending: false });

    const { count: unreadCount, error: countError } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId)
      // .eq("user_id", user.id)
      .eq("is_read", false);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, unreadCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, message, restaurantId } = body;

  if (!title || !message) {
    return NextResponse.json(
      { error: "Missing title or message" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();

    //Authorize user

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from("notifications").insert([
      {
        title,
        message,
        user_id: user.id,
        restaurant_id: restaurantId ?? null,
      },
    ]);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Error Adding notification" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { notificationId, restaurantId } = body;

    if (!notificationId || !restaurantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data: restaurants, error: restaurantError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", restaurantId);
    if (restaurantError) throw new Error(restaurantError.message);
    if (!restaurants) throw new Error("Restaurant not found");

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      // .eq("user_id", user.id);
      .eq("restaurant_id", restaurantId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Notification marked as read" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
