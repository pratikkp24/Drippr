"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export function ArchiveButton({ pieceId }: { pieceId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (!confirm("Archive this piece? It will be hidden from your closet.")) return;
    setBusy(true);
    const res = await fetch(`/api/user/pieces/${pieceId}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      router.push("/closet");
      router.refresh();
    } else {
      alert("Couldn’t archive.");
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="h-12 w-12 rounded-md border border-border text-text-3 hover:text-error hover:border-error transition-colors flex items-center justify-center disabled:opacity-50"
      aria-label="Archive piece"
      title="Archive piece"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
