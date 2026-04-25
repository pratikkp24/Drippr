"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AppError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AppError]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-lg">
      <div className="max-w-[440px] text-center animate-slideUp">
        <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-sm">
          Something slipped
        </p>
        <h1 className="fraunces text-[40px] leading-[1.05] mb-md">
          We hit a <em className="italic">snag.</em>
        </h1>
        <p className="font-light text-[15px] text-text-2 mb-xl">
          Try again. If it keeps happening, sign back in.
        </p>
        <div className="flex flex-col sm:flex-row gap-sm justify-center">
          <button
            onClick={reset}
            className="h-[48px] px-lg rounded-md bg-primary text-bg font-medium text-[14px] hover:bg-primary-hover transition-colors"
          >
            Try again
          </button>
          <Link
            href="/signin"
            className="h-[48px] px-lg rounded-md border border-border text-text-1 font-medium text-[14px] flex items-center justify-center hover:border-primary transition-colors"
          >
            Sign in
          </Link>
        </div>
        {error.digest && (
          <p className="mt-xl text-[11px] font-light text-text-3 font-mono">
            ref: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
