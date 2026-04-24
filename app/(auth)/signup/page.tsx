"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = await createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validPassword = password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);

  async function signUpWithPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!validPassword) {
      setError("Password must be at least 8 characters and include a letter and a number.");
      return;
    }
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding/profile`
      }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/onboarding/profile");
  }

  async function signInWithOAuth(provider: "google" | "apple") {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding/profile`
      }
    });
    if (error) {
      setError(error.message);
    }
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-bg">
      <div className="hidden lg:block relative bg-surface border-r border-border">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80)"
          }}
        />
      </div>

      <div className="flex items-center justify-center p-lg sm:p-xl">
        <div className="w-full max-w-[420px] animate-slideUp">
          <div className="text-[22px] font-semibold text-primary mb-2xl">Drippr.</div>
          <h1 className="fraunces text-[44px] leading-[1.05] text-text-1 mb-sm">
            Start your <em className="italic">taste</em> here.
          </h1>
          <p className="font-light text-[15px] text-text-2 mb-xl">
            Takes under a minute.
          </p>

          <form
            onSubmit={signUpWithPassword}
            className="space-y-md"
          >
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
              className="input-field w-full h-[48px] bg-surface border border-border rounded-md px-md text-[14px] text-text-1 focus:outline-none focus:border-primary transition-colors placeholder:text-text-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="Password"
                className="input-field w-full h-[48px] bg-surface border border-border rounded-md px-md pr-[72px] text-[14px] text-text-1 focus:outline-none focus:border-primary transition-colors placeholder:text-text-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-md top-1/2 -translate-y-1/2 text-[13px] text-text-2 hover:text-primary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {password.length > 0 && !validPassword && (
              <p className="text-[12px] font-light text-error -mt-sm">
                At least 8 characters with one letter and one number.
              </p>
            )}

            {error && <p className="text-[13px] text-error">{error}</p>}

            <button type="submit" disabled={loading} className="w-full h-[54px] bg-primary text-bg font-sans font-medium text-[15px] rounded-md hover:bg-primary-hover transition-colors disabled:opacity-70">
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <div className="flex items-center my-lg">
            <div className="flex-1 h-px bg-border" />
            <span className="px-md text-[12px] font-light text-text-3">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-sm mb-lg">
            <button
              onClick={() => signInWithOAuth("google")}
              type="button"
              className="w-full h-[48px] bg-surface rounded-md border border-border flex items-center justify-center relative hover:bg-border/50 transition-colors"
            >
              <svg className="absolute left-[20px] w-[20px] h-[20px]" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-sans font-medium text-[14px] text-text-1">Continue with Google</span>
            </button>
          </div>

          <p className="mt-lg text-[13px] text-text-2">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
          <p className="mt-md text-[11px] font-light text-text-3 leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/legal/terms" className="underline">Terms</Link> and{" "}
            <Link href="/legal/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
