// lib/menu/getImageForProduct.ts
import { createClient } from "@/lib/supabase/server";

export async function getImageForProduct(
  productName: string,
): Promise<string | null> {
  const normalized = productName?.trim().toLowerCase();
  if (!normalized) return null;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_images_for_keyword", {
    p: normalized,
  });

  if (error || !data || data.length === 0) return null;

  const row = data[0];

  if (!Array.isArray(row.image_urls) || row.image_urls.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * row.image_urls.length);
  return row.image_urls[randomIndex] ?? null;
}
