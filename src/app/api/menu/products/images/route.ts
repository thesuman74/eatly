import { createClient } from "@/lib/supabase/server";
import { serverService } from "@/lib/supabase/serverService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // console.log("Inserting into product_images:");

  try {
    const { productId, imageName, images } = await req.json();

    if (!productId || !imageName || !Array.isArray(images)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const inserts = images.map((url: string) => ({
      product_id: productId,
      url,
      alt: imageName, // ← product name as alt
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

  const { image_id } = await req.json();

  if (!image_id) {
    return NextResponse.json(
      { error: "Missing required image_id" },
      { status: 400 },
    );
  }

  try {
    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", image_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { error: "Failed to delete product image" },
      { status: 500 },
    );
  }
}
