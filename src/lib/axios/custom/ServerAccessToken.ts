// import { auth } from "@/auth";

// // Fetch access token from NextAuth session
// export async function getServerAccessToken(): Promise<string | null> {
//   try {
//     const session = await auth();
//     // console.log("session from getServerAccessToken", session);

//     // Prefer token from session
//     if (session && session.user && session.user.accessToken) {

//       return session.user.accessToken as string;
//     }

//     // // Fall back to static token from environment variables for development
//     // const staticAccessToken = process.env.NEXT_PUBLIC_STATIC_ACCESS_TOKEN;
//     // // const staticAccessToken =
//     // //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMxOTkxNzAwLCJpYXQiOjE3MzE1NTk3MDAsImp0aSI6ImQzZjEyZTVkMzJmNTQ3OGRhZTk0YjViZWZiNjEwYWI0IiwidXNlcl9pZCI6IjcwZWFiNDVhLWFjZWQtNDcyYS1iOTljLWQ2ZmU2YWM3MTU4NCJ9.kkYpF7xSdmtYdMlybzDJ0zBi9ceKkkHZdtgUtJye10k";

//     // if (staticAccessToken) {
//     //   console.warn("Using static access token from environment:");
//     //   return staticAccessToken;
//     // }

//     console.warn("No access token found in session or environment.");
//     return null;
//   } catch (error) {
//     console.error("Failed to get access token from session:", error);
//     return null;
//   }
// }
