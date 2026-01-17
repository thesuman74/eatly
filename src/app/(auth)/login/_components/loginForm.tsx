"use client";
import { useState } from "react";
import { login } from "@/lib/actions/login";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { LoginFormView } from "@/app/(auth)/login/_components/LoginFormView";

export function LoginForm({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const supabase = createBrowserSupabaseClient();

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard/r/products`,
        skipBrowserRedirect: false,
      },
    });
  }

  return (
    <LoginFormView
      onSubmit={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
      loading={loading}
      error={error}
      className={className}
    />
  );
}
