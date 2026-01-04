"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getUserPrimarySubdomain } from "../redis";
import { root } from "postcss";
import { protocol, rootDomain } from "../utils";

// export async function login(formData: FormData) {
//   const supabase = await createClient();

//   const credentials = {
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//   };

//   // 1️⃣ Sign in with Supabase
//   const { data, error } = await supabase.auth.signInWithPassword(credentials);
//   if (error) return error.message;

//   const userId = data.user.id;

//   // 2️⃣ Lookup restaurant subdomain via Redis utility
//   const subdomain = await getUserPrimarySubdomain(userId);
//   console.log("subdomain", subdomain);
//   if (!subdomain) return "No restaurant found for this user";

//   // 3️⃣ Revalidate cache if needed
//   revalidatePath("/", "layout");

//   // 4️⃣ Redirect to restaurant subdomain dashboard
//   const tenant = subdomain; // Redis lookup
//   const url =
//     process.env.NODE_ENV === "production"
//       ? `${protocol}://${rootDomain}/${tenant}/dashboard/products` // path-based routing
//       : `${protocol}://${tenant}.${rootDomain}/dashboard/products`; // local subdomain

//   redirect(url);
// }

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  console.log("login error", error);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/onboarding");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

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
