// src/app/api/menu/images/[name]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Type for your RPC result
type KeywordImagesRow = {
  image_urls: string[];
};

export async function GET(
  req: Request,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;

  const productName = name?.trim().toLowerCase();
  if (!productName) {
    return NextResponse.json(
      { status: "error", error: "Product name is required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // Call your RPC function
  const { data, error } = await supabase.rpc("get_images_for_keyword", {
    p: productName,
  });

  if (error || !data || data.length === 0) {
    return NextResponse.json(
      { status: "error", error: "No images found" },
      { status: 404 },
    );
  }

  // Step 1: get the first object (RPC returns array with one row)
  const row: KeywordImagesRow = data[0];

  // Step 2: robustness check for empty image_urls
  if (!Array.isArray(row.image_urls) || row.image_urls.length === 0) {
    return NextResponse.json(
      { status: "error", error: "No images found" },
      { status: 404 },
    );
  }

  // Step 3: pick a random image
  const randomIndex = Math.floor(Math.random() * row.image_urls.length);
  const randomImage = row.image_urls[randomIndex];

  // NOTE: Ensure the keywords column is indexed in DB for faster lookups
  // CREATE INDEX idx_keywords ON keyword_images USING gin (string_to_array(lower(keywords), ',') gin_trgm_ops);

  // Step 4: consistent response format
  return NextResponse.json({
    status: "success",
    data: {
      image: randomImage, // random single image
      images: row.image_urls, // all images for flexibility
    },
  });
}
