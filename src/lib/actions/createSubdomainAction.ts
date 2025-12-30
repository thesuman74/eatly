// createSubdomainAction.ts
"use server";

import { redis, setUserPrimarySubdomain } from "@/lib/redis";
import { createClient } from "../supabase/server";

export async function createSubdomainAction({
  subdomain,
  restaurantId,
}: {
  subdomain: string;
  restaurantId: string;
}) {
  const supabase = await createClient();
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

  const {
    data: { user },
  } = await supabase.auth.getUser(); // { id, email, ... }
  if (!user) throw new Error("User must be logged in");
  await redis.set(
    key,
    JSON.stringify({
      restaurantId,
      createdAt: Date.now(),
      ownerId: user.id, // store owner ID
    })
  );
  await setUserPrimarySubdomain(user.id, subdomain);
}
