"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import AuthShell from "@/components/auth/AuthShell";
import { requestPasswordReset } from "@/lib/firebase/auth";
import { isValidEmail } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rateLimit";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const rate = checkRateLimit(`reset-${email}`, 3, 300_000);
    if (!rate.allowed) {
      toast.error("Too many requests. Please wait a few minutes.");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch {
      // Intentionally show the same success state whether or not the email
      // exists, so this endpoint can't be used to enumerate registered
      // accounts.
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <p>
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      {sent ? (
        <div className="rounded-lg bg-brand-50 p-4 text-sm text-brand-800">
          If an account exists for <strong>{email}</strong>, a password reset link has been sent.
          Please check your inbox and spam folder.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              autoComplete="email"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
