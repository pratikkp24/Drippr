"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function SaveButton({
  dropId,
  initialSaved,
  variant = "floating"
}: {
  dropId: string;
  initialSaved: boolean;
  variant?: "floating" | "inline";
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    const next = !saved;
    setSaved(next); // optimistic
    try {
      const res = next
        ? await fetch("/api/saved-drops", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dropId })
          })
        : await fetch(`/api/saved-drops?dropId=${dropId}`, { method: "DELETE" });
      if (!res.ok) setSaved(!next); // revert on failure
    } catch {
      setSaved(!next);
    } finally {
      setBusy(false);
    }
  }

  if (variant === "floating") {
    return (
      <button
        onClick={toggle}
        disabled={busy}
        aria-label={saved ? "Unsave drop" : "Save drop"}
        aria-pressed={saved}
        className={`w-[44px] h-[44px] rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
          saved
            ? "bg-white text-error border-white"
            : "bg-white/10 text-white border-white/20 hover:bg-white hover:text-error"
        }`}
      >
        <Heart className="w-5 h-5" fill={saved ? "currentColor" : "none"} />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={saved ? "Unsave drop" : "Save drop"}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 h-[36px] px-md rounded-full border text-[13px] font-medium transition-colors ${
        saved
          ? "bg-surface text-primary border-primary"
          : "bg-surface text-text-2 border-border hover:border-primary"
      }`}
    >
      <Heart className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
