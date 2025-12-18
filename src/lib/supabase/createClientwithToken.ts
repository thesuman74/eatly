import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClientWithToken(token: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing Supabase URL");
  }

  if (!token) {
    throw new Error("Token is required to initialize client with RLS support");
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    token // ✅ token used as session key for RLS
  );
}
