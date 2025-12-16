"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  console.log("🔐 Login attempt:");
  console.log("User:", credentials.email);
  console.log("Error:", error);
  console.log("Session:", data?.session);
  console.log("User:", data?.user);

  if (error) {
    return error.message; // ❌ login failed
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/products");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  console.log("signup called");
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);
  console.log("signup error", error);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
