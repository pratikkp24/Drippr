"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useDebounce } from "@/hooks/use-debounce";

const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed");

export default function OnboardingProfileForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const debouncedUsername = useDebounce(username, 400);

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    async function checkUsername() {
      if (!debouncedUsername) {
        setUsernameError(null);
        setIsAvailable(false);
        return;
      }
      
      try {
        usernameSchema.parse(debouncedUsername);
      } catch (err: any) {
        setUsernameError(err.errors[0].message);
        setIsAvailable(false);
        return;
      }

      setCheckingUsername(true);
      const res = await fetch(`/api/onboarding/check-username?q=${encodeURIComponent(debouncedUsername)}`);
      const data = await res.json();
      setCheckingUsername(false);

      if (!res.ok) {
        setUsernameError(data.error || "Failed to check username");
        setIsAvailable(false);
      } else {
        if (data.available) {
          setUsernameError(null);
          setIsAvailable(true);
        } else {
          setUsernameError("Username is already taken");
          setIsAvailable(false);
        }
      }
    }
    checkUsername();
  }, [debouncedUsername]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAvailable || !displayName.trim()) return;

    setLoading(true);
    const res = await fetch("/api/onboarding/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, displayName })
    });

    setLoading(false);
    if (res.ok) {
      router.push("/onboarding/taste");
    } else {
      const data = await res.json();
      setUsernameError(data.error || "Something slipped. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center p-lg sm:p-xl">
      <div className="w-full max-w-[420px] animate-slideUp">
        <h1 className="fraunces text-[44px] leading-[1.05] text-text-1 mb-sm">
          Pick your <em className="italic">handle.</em>
        </h1>
        <p className="font-light text-[15px] text-text-2 mb-2xl">
          Takes under a minute.
        </p>

        <form onSubmit={handleSubmit} className="space-y-md">
          <div>
            <div className="relative">
              <span className="absolute left-md top-1/2 -translate-y-1/2 text-[16px] text-text-3 font-sans">
                @
              </span>
              <input
                type="text"
                required
                placeholder="username"
                className={`input-field w-full h-[48px] bg-surface border border-border rounded-md pl-[32px] pr-[40px] text-[16px] font-sans text-text-1 focus:outline-none focus:border-primary transition-colors placeholder:text-text-3 ${
                  usernameError ? "border-error" : isAvailable ? "border-success" : ""
                }`}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
              />
              <div className="absolute right-md top-1/2 -translate-y-1/2">
                {checkingUsername && <div className="w-4 h-4 rounded-full border-2 border-border border-t-text-3 animate-spin" />}
                {!checkingUsername && isAvailable && (
                  <svg className="w-[18px] h-[18px] text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
            </div>
            {usernameError && (
              <p className="text-[12px] font-light text-error mt-sm">
                {usernameError}
              </p>
            )}
          </div>

          <input
            type="text"
            required
            placeholder="Display name"
            className="input-field w-full h-[48px] bg-surface border border-border rounded-md px-md text-[16px] font-sans text-text-1 focus:outline-none focus:border-primary transition-colors placeholder:text-text-3 mb-xl"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading || !isAvailable || !displayName.trim()}
            className="w-full h-[54px] bg-primary text-bg font-sans font-medium text-[15px] rounded-md hover:bg-primary-hover transition-colors disabled:opacity-70 mt-xl"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
