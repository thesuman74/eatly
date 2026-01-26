"use client";
import { useEffect, useState } from "react";
import { login } from "@/lib/actions/login";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { LoginFormView } from "@/app/(auth)/login/_components/LoginFormView";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push("/dashboard/r/products"); // logged in
      }
    });

    // Optional: listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) router.push("/dashboard/r/products");
    });
  }, [router, supabase]);

  async function handleGoogleLogin() {
    console.log("google login");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard/r/products`,
      },
    });
  }

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`, // where user lands after reset
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent! Check your inbox.");
    }

    setLoading(false);
  };

  return (
    <LoginFormView
      onSubmit={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
      onForgotPassword={handleForgotPassword}
      loading={loading}
      error={error}
      className={className}
    />
  );
}
