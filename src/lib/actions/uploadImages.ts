import { createBrowserSupabaseClient } from "../supabase/client";

export async function uploadProductImages(productId: string, files: File[]) {
  const supabase = createBrowserSupabaseClient(); // browser client

  console.log("uploadProductImages called");

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const filePath = `products/${productId}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("product-images-storage")
      .upload(filePath, file);

    if (error) throw error;

    const publicUrl = supabase.storage
      .from("product-images-storage")
      .getPublicUrl(filePath).data.publicUrl;

    uploadedUrls.push(publicUrl);
  }

  return uploadedUrls;
}
