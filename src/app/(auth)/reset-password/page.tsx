"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ResetPasswordView } from "./ResetPassworView";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserSupabaseClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <ResetPasswordView
        onSubmit={handleResetPassword}
        loading={loading}
        error={error}
      />
    </div>
  );
}
