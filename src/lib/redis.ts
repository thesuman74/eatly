import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

type SubdomainData = {
  restaurantId: string;
  createdAt: number;
};

export async function getRestaurantById(id: string) {
  const data = await redis.get(`restaurant:${id}`);
  console.log("data redis", data);
  return data ? JSON.parse(data as string) : null;
}

export async function getRestaurantBySubdomain(subdomain: string) {
  const data = await redis.get(`subdomain:${subdomain}`);
  return data ? JSON.parse(data as string) : null;
}

export async function getSubdomainData(subdomain: string) {
  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const data = await redis.get<SubdomainData>(
    `subdomain:${sanitizedSubdomain}`
  );
  return data;
}
