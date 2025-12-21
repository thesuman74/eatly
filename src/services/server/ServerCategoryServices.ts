import { createClient } from "@/lib/supabase/server";

export async function getCategoriesFromDB() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .order("position", { ascending: true });

  const { data: products, error: productsError } = await supabase
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
