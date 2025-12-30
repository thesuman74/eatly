import { NextRequest, NextResponse } from "next/server";
import { rootDomain } from "@/lib/utils";
import { getRestaurantBySubdomain, getSubdomainData } from "@/lib/redis";

function extractSubdomain(request: NextRequest): string | null {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  if (hostname.includes(".localhost")) {
    return hostname.split(".")[0]; // e.g., 'pasal'
  }

  const root = rootDomain.split(":")[0];
  if (hostname.endsWith(`.${root}`) && hostname !== root) {
    return hostname.replace(`.${root}`, "");
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // 🔹 INCOMING REQUEST LOG
  console.log("[INCOMING]", {
    host: request.headers.get("host"),
    pathname,
    subdomain,
  });

  // 1️⃣ Allow Next.js internals, API routes, and assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/onboarding")
  ) {
    console.log("[AUTH BYPASS]", pathname);
    return NextResponse.next();
  }

  // 2️⃣ Handle subdomain-based routing
  if (subdomain) {
    const restaurant = await getSubdomainData(subdomain);
    console.log("restaurant", restaurant);

    if (!restaurant) {
      return NextResponse.redirect(new URL("/not_found", request.url));
    }

    const url = request.nextUrl.clone();

    // ✅ DASHBOARD ROUTES
    if (pathname.startsWith("/dashboard")) {
      url.pathname =
        `/dashboard/${restaurant.restaurantId}` +
        pathname.replace("/dashboard", "");
      return NextResponse.rewrite(url);
    }
    // 🔹 OUTGOING REWRITE LOG (dashboard)
    console.log("[REWRITE]", {
      from: pathname,
      to: url.pathname,
      type: "dashboard",
    });

    // ✅ PUBLIC ROUTES
    url.pathname = `/${restaurant.restaurantId}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // // 3️⃣ Root domain → login
  // if (pathname === "/") {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
