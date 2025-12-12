import { serverService } from "@/lib/supabase/serverService";

export async function getCategoriesFromDB() {
  const { data: categories, error: categoriesError } = await serverService
    .from("categories")
    .select("*")
    .order("position", { ascending: true });

  const { data: products, error: productsError } = await serverService
    .from("products")
    .select("*, images:product_images(*)")
    .order("position", { ascending: true });

  if (categoriesError || productsError) {
    throw new Error(categoriesError?.message || productsError?.message);
  }

  // Optional: structure products under categories
  const structured = categories.map((cat) => ({
    ...cat,
    products: products.filter((p) => p.category_id === cat.id),
  }));

  return structured;
}
