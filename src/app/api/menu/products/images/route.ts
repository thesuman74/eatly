import { serverService } from "@/lib/supabase/serverService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // console.log("Inserting into product_images:");

  try {
    const { productId, ImageName, images } = await req.json();

    if (!productId || !ImageName || !Array.isArray(images)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const inserts = images.map((url: string) => ({
      product_id: productId,
      url,
      alt: ImageName, // ← product name as alt
    }));

    const { error } = await serverService
      .from("product_images")
      .insert(inserts);

    console.log("Insert error:", error);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Upload error:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
