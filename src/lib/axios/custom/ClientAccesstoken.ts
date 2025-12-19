import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { getSession } from "next-auth/react"; // For client-side session management

/**
 * Fetches an access token from the client-side session,
 * with a fallback to a static token if needed.
 */
export async function getClientAccessToken(): Promise<string | null> {
  try {
    // const fallbackToken = process.env.NEXT_PUBLIC_STATIC_ACCESS_TOKEN; // Fallback token for development

    // Fetch client-side session using `getSession`
    const supabase = createBrowserSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("session from getClientAccessToken", session);

    if (session?.access_token) {
      return session.access_token;
    }
    console.warn("No access token found in Supabase session.");
    return null;
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
}
