import { getSession } from "next-auth/react"; // For client-side session management

/**
 * Fetches an access token from the client-side session,
 * with a fallback to a static token if needed.
 */
export async function getClientAccessToken(): Promise<string | null> {
  try {
    // const fallbackToken = process.env.NEXT_PUBLIC_STATIC_ACCESS_TOKEN; // Fallback token for development

    // Fetch client-side session using `getSession`
    const session = await getSession();
    console.log("session from getClientAccessToken", session);

    // if (session && session.user && session.user.accessToken) {

    //   return session.user.accessToken as string;
    // }

    // if (fallbackToken) {
    //   console.warn("Using static fallback token in client-side context.");
    //   return fallbackToken;
    // }

    console.warn("No access token found in client-side session or fallback.");
    return null;
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
}
