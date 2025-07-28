"use server";
import { createClient } from "@/lib/supabase/server";

// if using Server Actions (Next.js 14+)

export async function updateCategoryName(categoryId: string, newName: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({ name: newName })
    .eq("id", categoryId);

  if (error) {
    console.error("Failed to update category name:", error.message);
    return false;
  }

  return true;
}

export const updateCategoryPositions = async (
  categoryId: string,
  newPosition: string
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({ position: newPosition })
    .eq("id", categoryId);

  if (error) {
    console.error("Failed to update category position:", error.message);
    throw error;
  }
};

export const updateProductPosition = async (
  productId: string,
  newPosition: string
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ position: newPosition })
    .eq("id", productId);

  if (error) {
    console.error("Failed to update product position:", error.message);
    throw error;
  }
};
