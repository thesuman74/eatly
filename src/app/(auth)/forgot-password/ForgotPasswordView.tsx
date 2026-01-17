"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordViewProps {
  onSubmit: (email: string) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
}

export function ForgotPasswordView({
  onSubmit,
  loading,
}: ForgotPasswordViewProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    const result = await onSubmit(email);
    setMessage(result.message);
    setSubmitting(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Forgot Password?</CardTitle>
        <CardDescription>
          Enter your email to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={submitting || loading}>
            {submitting ? "Sending..." : "Send Reset Link"}
          </Button>

          {message && (
            <p className="text-center text-md text-muted-foreground">
              {message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
