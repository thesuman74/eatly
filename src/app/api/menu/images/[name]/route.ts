// app/api/menu/images/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  context: { params: { name: string } }, // params comes directly
) {
  console.log("context", context);

  const { name } = await context.params;

  const productName = name?.trim().toLowerCase();
  console.log("productName", productName);

  if (!productName) {
    return NextResponse.json(
      { error: "Product name is required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // Call your RPC function
  const { data, error } = await supabase.rpc("get_images_for_keyword", {
    p: productName,
  });

  console.log("data", data);

  if (error || !data) {
    return NextResponse.json({ error: "No images found" }, { status: 404 });
  }

  // Step 1: get the first object (your RPC returns array with one row)
  const row = data[0];

  // Step 2: pick a random index from image_urls
  const randomIndex = Math.floor(Math.random() * row.image_urls.length);

  // Step 3: get the random URL
  const randomImage = row.image_urls[randomIndex];

  console.log(randomImage);

  return NextResponse.json({ image: randomImage });
}
