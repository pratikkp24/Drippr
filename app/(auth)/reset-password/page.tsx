"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/profile/settings`
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-lg">
      <div className="w-full max-w-[420px] animate-slideUp">
        <div className="text-[22px] font-semibold text-primary mb-2xl">Drippr.</div>
        {sent ? (
          <>
            <h1 className="fraunces text-[40px] leading-[1.05] mb-sm">
              Check your <em className="italic">inbox.</em>
            </h1>
            <p className="font-light text-[15px] text-text-2">
              We sent a reset link to {email}.
            </p>
          </>
        ) : (
          <>
            <h1 className="fraunces text-[40px] leading-[1.05] mb-sm">
              Reset your <em className="italic">password.</em>
            </h1>
            <p className="font-light text-[15px] text-text-2 mb-xl">We’ll email you a link.</p>
            <form onSubmit={onSubmit} className="space-y-md">
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-[13px] text-error">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        )}
        <p className="mt-lg text-[13px] text-text-2">
          <Link href="/signin" className="text-primary underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
