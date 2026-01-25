// src/app/api/menu/images/[name]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type KeywordImagesRow = {
  keywords: string;
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

  const { data, error } = await supabase.rpc("get_images_for_keyword", {
    p: productName,
  });

  if (error || !data || data.length === 0) {
    return NextResponse.json(
      { status: "error", error: "No images found" },
      { status: 404 },
    );
  }

  const row = data[0] as KeywordImagesRow;

  if (!Array.isArray(row.image_urls) || row.image_urls.length === 0) {
    return NextResponse.json(
      { status: "error", error: "No images found" },
      { status: 404 },
    );
  }

  const randomIndex = Math.floor(Math.random() * row.image_urls.length);

  return NextResponse.json({
    status: "success",
    data: {
      keyword: row.keywords,
      image: row.image_urls[randomIndex],
      images: row.image_urls,
    },
  });
}
