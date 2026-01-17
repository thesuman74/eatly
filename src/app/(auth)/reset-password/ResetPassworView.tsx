"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResetPasswordViewProps {
  onSubmit: (
    password: string,
  ) => Promise<{ success: boolean; message: string } | void>;
  loading: boolean;
  error: string | null;
}

export function ResetPasswordView({
  onSubmit,
  loading,
  error,
}: ResetPasswordViewProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const result = await onSubmit(password);
    if (result?.success) {
      setMessage(result.message);
      // redirect after a short delay
      setTimeout(() => (window.location.href = "/login"), 2000);
    } else {
      setMessage(result?.message || "Something went wrong.");
    }
    setSubmitting(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="**********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={loading || submitting}>
            {submitting ? "Updating..." : "Update Password"}
          </Button>
          {(message || error) && (
            <p className="text-center text-sm text-muted-foreground">
              {message || error}
            </p>
          )}
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        You will be redirected to login after successful update
      </CardFooter>
    </Card>
  );
}
