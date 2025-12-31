// import { NextRequest, NextResponse } from "next/server";
// import { rootDomain } from "@/lib/utils";
// import { getRestaurantBySubdomain, getSubdomainData } from "@/lib/redis";

// function extractSubdomain(request: NextRequest): string | null {
//   const host = request.headers.get("host") || "";
//   const hostname = host.split(":")[0];

//   if (hostname.includes(".lvh.me")) {
//     return hostname.split(".")[0]; // e.g., 'pasal'
//   }

//   const root = rootDomain.split(":")[0];
//   if (hostname.endsWith(`.${root}`) && hostname !== root) {
//     return hostname.replace(`.${root}`, "");
//   }

//   return null;
// }

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const subdomain = extractSubdomain(request);
//   console.log("subdomain", subdomain);
//   console.log("pathname", pathname);

//   // 🔹 INCOMING REQUEST LOG
//   console.log("[INCOMING]", {
//     host: request.headers.get("host"),
//     pathname,
//     subdomain,
//   });

//   // 1️⃣ Allow Next.js internals, API routes, and assets
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.includes(".")
//   ) {
//     return NextResponse.next();
//   }

//   if (
//     pathname.startsWith("/login") ||
//     pathname.startsWith("/register") ||
//     pathname.startsWith("/onboarding")
//   ) {
//     console.log("[AUTH BYPASS]", pathname);
//     return NextResponse.next();
//   }

//   // 2️⃣ Handle subdomain-based routing
//   if (subdomain) {
//     const restaurant = await getSubdomainData(subdomain);

//     if (!restaurant) {
//       return NextResponse.redirect(new URL("/not_found", request.url));
//     }

//     const url = request.nextUrl.clone();

//     // ✅ DASHBOARD ROUTES
//     if (pathname.startsWith("/dashboard")) {
//       // Rewrite clean URL to folder structure internally
//       url.pathname = `/dashboard/${restaurant.restaurantId}${pathname.replace(
//         "/dashboard",
//         ""
//       )}`;
//       return NextResponse.rewrite(url);
//     }

//     // ✅ PUBLIC ROUTES
//     url.pathname = `/${restaurant.restaurantId}${pathname}`;
//     return NextResponse.rewrite(url);
//   }

//   // // 3️⃣ Root domain → login
//   // if (pathname === "/") {
//   //   return NextResponse.redirect(new URL("/login", request.url));
//   // }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|api|favicon.ico).*)"],
// };

import { NextRequest, NextResponse } from "next/server";
import { rootDomain, protocol } from "@/lib/utils";
import { getSubdomainData } from "@/lib/redis";

/**
 * Extract tenant/restaurant slug
 * - Dev: from subdomain (pasal.lvh.me)
 * - Prod: from path (/pasal/...)
 */
function extractTenant(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  if (process.env.NODE_ENV === "development") {
    if (host.includes(".lvh.me")) {
      return host.split(".")[0]; // 'pasal.lvh.me' -> 'pasal'
    }
  } else {
    // production: first path segment
    const segments = pathname.split("/").filter(Boolean);
    return segments[0] || null; // '/pasal/dashboard' -> 'pasal'
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tenant = extractTenant(request);

  console.log("[INCOMING]", {
    host: request.headers.get("host"),
    pathname,
    tenant,
  });

  // 1️⃣ Allow Next.js internals, API routes, and assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Auth bypass routes
  if (
    ["/login", "/register", "/onboarding"].some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  // 3️⃣ Handle tenant-based routing
  if (tenant) {
    const restaurant = await getSubdomainData(tenant.toLowerCase());
    if (!restaurant) {
      return NextResponse.redirect(new URL("/not_found", request.url));
    }

    const url = request.nextUrl.clone();

    // Internal folder structure: dashboard/[restaurantId]/page.tsx
    if (pathname.includes("/dashboard")) {
      if (process.env.NODE_ENV === "production") {
        // Remove first path segment (tenant) before rewriting
        const newPath = pathname.replace(`/${tenant}`, "");
        url.pathname = `/dashboard/${restaurant.restaurantId}${newPath.replace(
          "/dashboard",
          ""
        )}`;
      } else {
        // Local: rewrite using restaurantId
        url.pathname = `/dashboard/${restaurant.restaurantId}${pathname.replace(
          "/dashboard",
          ""
        )}`;
      }
      return NextResponse.rewrite(url);
    }

    // Public routes: prepend restaurantId
    if (process.env.NODE_ENV === "production") {
      // Remove tenant from path in prod
      const newPath = pathname.replace(`/${tenant}`, "");
      url.pathname = `/${restaurant.restaurantId}${newPath}`;
    } else {
      url.pathname = `/${restaurant.restaurantId}${pathname}`;
    }

    return NextResponse.rewrite(url);
  }

  // 4️⃣ Root domain fallback (optional)
  // return NextResponse.redirect(new URL("/login", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
