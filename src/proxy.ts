import { NextRequest, NextResponse } from "next/server";
import { rootDomain } from "@/lib/utils";
import { getRestaurantBySubdomain, getSubdomainData } from "@/lib/redis";

function extractSubdomain(request: NextRequest): string | null {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  if (hostname.includes(".localhost")) {
    return hostname.split(".")[0]; // e.g., 'pasal' from 'pasal.localhost'
  }

  // Production: extract subdomain from main domain
  const root = rootDomain.split(":")[0];
  if (hostname.endsWith(`.${root}`) && hostname !== root) {
    return hostname.replace(`.${root}`, "");
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // 1️⃣ Allow Next.js internals, API routes, and assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2️⃣ If subdomain exists, rewrite to restaurantId page
  if (subdomain) {
    const restaurant = await getSubdomainData(subdomain);
    console.log("restaurant in proxy", restaurant);

    if (!restaurant) {
      return NextResponse.redirect(new URL("/not_found", request.url));
    }

    // Rewrite to internal route without changing the URL in browser
    const url = request.nextUrl.clone();
    url.pathname = `/${restaurant.restaurantId}${
      pathname === "/" ? "" : pathname
    }`;
    return NextResponse.rewrite(url);
  }

  // 3️⃣ If root domain and `/`, redirect to login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4️⃣ Allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
