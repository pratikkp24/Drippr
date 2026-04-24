"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton({
  url,
  title,
  variant = "floating"
}: {
  url: string;
  title: string;
  variant?: "floating" | "inline";
}) {
  const [justCopied, setJustCopied] = useState(false);

  async function handleShare() {
    const shareUrl = new URL(url, typeof window !== "undefined" ? window.location.origin : "").toString();
    const nav = typeof navigator !== "undefined" ? navigator : null;
    if (nav && typeof nav.share === "function") {
      try {
        await nav.share({ title, url: shareUrl });
        return;
      } catch {
        /* user cancelled — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  if (variant === "floating") {
    return (
      <button
        onClick={handleShare}
        aria-label="Share"
        className="w-[44px] h-[44px] rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-bg transition-all"
      >
        {justCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Share"
      className="inline-flex items-center gap-2 h-[36px] px-md rounded-full border border-border bg-surface text-[13px] font-medium text-text-2 hover:border-primary transition-colors"
    >
      {justCopied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
      {justCopied ? "Link copied" : "Share"}
    </button>
  );
}
