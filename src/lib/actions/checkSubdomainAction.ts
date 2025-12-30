"use server";

import { redis } from "../redis";

export async function checkSubdomainAvailabilityAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get("subdomain") as string;

  if (!subdomain) {
    return { error: "Subdomain is required" };
  }

  const sanitized = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");

  if (sanitized !== subdomain) {
    return {
      error: "Subdomain can only have lowercase letters, numbers, and hyphens.",
    };
  }

  const exists = await redis.get(`subdomain:${sanitized}`);

  return {
    available: !exists,
    subdomain: sanitized,
  };
}
