"use client";

import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";

export function ShopButton({
  originalUrl,
  partnerName,
  partnerId,
  pieceId,
  dropId,
  className,
  label
}: {
  originalUrl: string;
  partnerName?: string | null;
  partnerId?: string | null;
  pieceId?: string | null;
  dropId?: string | null;
  className?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/affiliate/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl, partnerId, pieceId, dropId })
      });
      const data = await res.json().catch(() => ({}));
      const target = data?.redirectUrl || originalUrl;
      window.open(target, "_blank", "noopener,noreferrer");
    } catch {
      window.open(originalUrl, "_blank", "noopener,noreferrer");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={
        className ||
        "inline-flex items-center gap-2 h-[40px] px-lg bg-white/90 backdrop-blur-md rounded-full text-[13px] font-medium text-text-1 shadow-sm hover:bg-white transition-colors"
      }
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
      {label || (partnerName ? `Shop on ${partnerName}` : "Shop")}
    </button>
  );
}
