"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function GuestBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("guest-banner-dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("guest-banner-dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-surface border-b border-border px-md sm:px-lg py-2 animate-screenIn">
      <div className="flex items-center gap-sm max-w-[1200px] mx-auto">
        <p className="flex-1 text-[12px] sm:text-[13px] text-text-2 leading-snug">
          <span className="hidden sm:inline">You’re exploring </span>
          <span className="font-semibold text-primary">Drippr.</span>{" "}
          <span className="hidden sm:inline">Sign up to save, follow, build your closet.</span>
          <span className="sm:hidden">Sign up to save and follow.</span>{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline whitespace-nowrap">
            Sign up →
          </Link>
        </p>
        <button
          onClick={dismiss}
          className="p-xs text-text-3 hover:text-text-1 transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
