import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export async function getCategoriesFromDB(restaurantId: string) {
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
    .eq("restaurant_id", restaurantId)
    .order("position", { ascending: true });

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*, images:product_images(*)")
    .eq("restaurant_id", restaurantId)
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

export async function getPublicCategoriesFromDB(restaurantId: string) {
  const supabase = await createClient();

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("isVisible", true) // enforce visibility
    .order("position", { ascending: true });

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*, images:product_images(*)")
    .eq("restaurant_id", restaurantId)
    .order("position", { ascending: true });

  if (categoriesError || productsError) {
    throw new Error(categoriesError?.message || productsError?.message);
  }

  const structured = categories.map((cat) => ({
    ...cat,
    products: products.filter((p) => p.category_id === cat.id),
  }));

  return structured;
}
