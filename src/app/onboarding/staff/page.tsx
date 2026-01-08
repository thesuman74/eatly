"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import StaffOnboardingPage from "../_components/StaffOnboardingPage";
import { createClient } from "@/lib/supabase/server";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));
    const token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const type = params.get("type");

    if (!token || type !== "invite") {
      console.error("Invalid magic link");
      router.replace("/login");
      return;
    }

    supabase.auth
      .setSession({ access_token: token, refresh_token: refresh_token || "" })
      .then(({ error }) => {
        if (error) {
          console.error("Failed to set session:", error.message);
          router.replace("/login");
        } else {
          setLoading(false);
        }
      });
  }, [router, supabase]);

  if (loading) return <p>Loading...</p>;

  return <StaffOnboardingPage />;
};

export default page;
