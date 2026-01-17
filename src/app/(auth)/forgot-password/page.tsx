"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ForgotPasswordView } from "./ForgotPasswordView";

export default function ForgotPasswordPage() {
  const supabase = createBrowserSupabaseClient();
  const [loading, setLoading] = useState(false);

  // Handle forgot password submit
  const handleForgotPassword = async (email: string) => {
    if (!email) {
      return { success: false, message: "Please enter your email" };
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Password reset email sent! Check your inbox.",
    };
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <ForgotPasswordView onSubmit={handleForgotPassword} loading={loading} />
    </div>
  );
}
