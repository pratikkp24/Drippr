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
    <div className="h-[44px] bg-surface border-b border-border flex items-center px-lg justify-between animate-screenIn">
      <div className="flex-1 flex justify-center items-center gap-sm">
        <p className="text-[13px] text-text-2">
          You're exploring <span className="font-semibold text-primary">Drippr.</span> Sign up to save, follow, build your closet.
        </p>
        <Link href="/signup" className="text-[13px] font-medium text-primary hover:underline">
          Sign up →
        </Link>
      </div>
      <button 
        onClick={dismiss}
        className="p-xs text-text-3 hover:text-text-1 transition-colors"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
