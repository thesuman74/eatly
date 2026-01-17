"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ResetPasswordView } from "./ResetPassworView";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userValid, setUserValid] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      console.log("user", user);
      if (error || !user) {
        // User not logged in → redirect to login
        router.replace("/login");
      } else {
        setUserValid(true);
      }
      setLoading(false);
    };

    checkUser();
  }, [router, supabase]);

  const handleResetPassword = async (password: string) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return { success: false, message: error.message };
    }

    return { success: true, message: "Password updated successfully!" };
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <p className="text-muted-foreground text-lg animate-pulse">
          Loading...
        </p>
      </div>
    );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {userValid && (
        <ResetPasswordView
          onSubmit={handleResetPassword}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}
