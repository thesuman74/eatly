import { can } from "@/lib/rbac/can";
import { Permission } from "@/lib/rbac/permission";
import { createClient } from "@/lib/supabase/server";
import { serverService } from "@/lib/supabase/serverService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // console.log("Inserting into product_images:");

  try {
    const { productId, imageName, images, restaurantId } = await req.json();

    if (!productId || !imageName || !Array.isArray(images)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const inserts = images.map((url: string) => ({
      product_id: productId,
      url,
      alt: imageName,
      restaurant_id: restaurantId,
    }));

    const { error } = await serverService
      .from("product_images")
      .insert(inserts);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Upload error:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const supabase = await createClient();

  try {
    const url = new URL(req.url);
    const imageId = url.searchParams.get("imageId");
    const restaurantId = url.searchParams.get("restaurantId"); // pass via query param

    if (!imageId) {
      return NextResponse.json(
        { error: "Missing required imageId" },
        { status: 400 },
      );
    }

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Missing required restaurantId" },
        { status: 400 },
      );
    }

    // Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch role + restaurant assignment
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, restaurant_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Permission check
    if (!can({ role: userData.role, permission: Permission.DELETE_PRODUCT })) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // Verify restaurant ownership
    const { data: restaurant, error: restError } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .eq("owner_id", user.id)
      .single();

    if (restError || !restaurant) {
      return NextResponse.json(
        { error: "Not authorized for this restaurant" },
        { status: 403 },
      );
    }

    // Verify image belongs to a product in this restaurant
    const { data: image, error: imgError } = await supabase
      .from("product_images")
      .select("id, product_id")
      .eq("id", imageId)
      .single();

    if (imgError || !image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const { data: product, error: prodError } = await supabase
      .from("products")
      .select("id")
      .eq("id", image.product_id)
      .eq("restaurant_id", restaurantId)
      .single();

    if (prodError || !product) {
      return NextResponse.json(
        { error: "Image does not belong to this restaurant's product" },
        { status: 404 },
      );
    }

    // Delete image
    const { error: deleteError } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: "Image deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product image" },
      { status: 500 },
    );
  }
}
