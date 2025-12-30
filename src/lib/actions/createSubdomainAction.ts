// createSubdomainAction.ts
"use server";

import { redis } from "@/lib/redis";

export async function createSubdomainAction({
  subdomain,
  restaurantId,
}: {
  subdomain: string;
  restaurantId: string;
}) {
  const key = `subdomain:${subdomain}`;

  if (!subdomain) {
    throw new Error("Subdomain is required");
  }

  if (!restaurantId) {
    throw new Error("Restaurant ID is required");
  }

  const exists = await redis.get(key);
  if (exists) {
    throw new Error("Subdomain already taken");
  }
  await redis.set(
    key,
    JSON.stringify({
      restaurantId,
      createdAt: Date.now(),
    })
  );
}
