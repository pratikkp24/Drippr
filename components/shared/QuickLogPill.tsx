"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, X, Sparkles } from "lucide-react";

type Piece = {
  id: string;
  name: string;
  primaryPhoto: string | null;
  category: string;
};

const OCCASIONS = ["CASUAL", "WORK", "EVENING", "TRAVEL", "FORMAL", "FESTIVE", "PARTY", "EVENT"] as const;
const FEELINGS = [
  { value: "LOVED", label: "Loved it" },
  { value: "FINE", label: "Fine" },
  { value: "WOULDNT_REPEAT", label: "Wouldn’t repeat" }
] as const;

function humanize(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ");
}

export function QuickLogPill() {
  const [open, setOpen] = useState(false);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [occasion, setOccasion] = useState<string>("");
  const [feeling, setFeeling] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!open || pieces.length > 0) return;
    setLoading(true);
    fetch("/api/user/pieces")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Piece[]) => setPieces(data))
      .catch(() => setPieces([]))
      .finally(() => setLoading(false));
  }, [open, pieces.length]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function reset() {
    setSelected(new Set());
    setOccasion("");
    setFeeling("");
    setNotes("");
  }

  async function submit() {
    if (selected.size === 0) return;
    setSaving(true);
    const res = await fetch("/api/wear-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pieceIds: Array.from(selected),
        occasion: occasion || undefined,
        feeling: feeling || undefined,
        notes: notes || undefined
      })
    });
    setSaving(false);
    if (res.ok) {
      setOpen(false);
      reset();
      setToast("Today’s outfit logged.");
      setTimeout(() => setToast(null), 2400);
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Failed to log");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[84px] lg:bottom-6 right-6 z-40 h-[52px] px-lg rounded-full bg-primary text-bg font-medium text-[14px] shadow-lg hover:bg-primary-hover transition-all flex items-center gap-2"
        aria-label="Log today’s outfit"
      >
        <Sparkles className="w-4 h-4" />
        Log today
      </button>

      {toast && (
        <div className="fixed bottom-[160px] left-1/2 -translate-x-1/2 z-50 bg-primary text-bg text-[13px] font-medium px-lg py-2.5 rounded-full shadow-lg animate-slideUp">
          {toast}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-lg">
          <div className="w-full sm:max-w-[640px] bg-bg sm:rounded-xl border border-border max-h-[92vh] flex flex-col">
            <header className="px-lg py-md border-b border-border flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[2px] uppercase text-text-3">Today</p>
                <h2 className="fraunces text-[22px]">What are you <em className="italic">wearing</em>?</h2>
              </div>
              <button onClick={() => setOpen(false)} className="text-text-3 hover:text-primary">
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-lg space-y-lg">
              <div>
                <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-sm">
                  Pick pieces ({selected.size})
                </p>
                {loading ? (
                  <p className="text-[13px] text-text-3 py-md">Loading your closet…</p>
                ) : pieces.length === 0 ? (
                  <p className="text-[13px] font-light text-text-3 italic py-md">
                    Add pieces to your closet first.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-sm">
                    {pieces.map((p) => {
                      const isSel = selected.has(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => toggle(p.id)}
                          className={`relative aspect-[4/5] rounded-lg overflow-hidden border-2 transition-all ${
                            isSel ? "border-primary" : "border-transparent"
                          }`}
                        >
                          {p.primaryPhoto ? (
                            <Image src={p.primaryPhoto} alt={p.name} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 bg-surface flex items-center justify-center text-[10px] text-text-3">
                              No photo
                            </div>
                          )}
                          {isSel && (
                            <div className="absolute inset-0 bg-primary/25 flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full bg-bg flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary" />
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 text-left">
                            <p className="text-[10px] font-medium text-white truncate">{p.name}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-sm">Occasion</p>
                <div className="flex flex-wrap gap-1.5">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o}
                      onClick={() => setOccasion(occasion === o ? "" : o)}
                      className={`px-md h-8 rounded-full text-[12px] font-medium border transition-colors ${
                        occasion === o
                          ? "bg-primary text-bg border-primary"
                          : "bg-surface text-text-2 border-border hover:border-accent"
                      }`}
                    >
                      {humanize(o)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-sm">Feeling</p>
                <div className="flex flex-wrap gap-1.5">
                  {FEELINGS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFeeling(feeling === f.value ? "" : f.value)}
                      className={`px-md h-8 rounded-full text-[12px] font-medium border transition-colors ${
                        feeling === f.value
                          ? "bg-primary text-bg border-primary"
                          : "bg-surface text-text-2 border-border hover:border-accent"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-sm">Note (optional)</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Where’d you wear this?"
                  className="w-full rounded-md bg-surface border border-border p-sm text-[14px] text-text-1 focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>

            <footer className="px-lg py-md border-t border-border flex items-center gap-sm">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 h-12 rounded-md border border-border text-[14px] font-medium text-text-2 hover:border-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={selected.size === 0 || saving}
                className="flex-[2] h-12 rounded-md bg-primary text-bg text-[14px] font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:hover:bg-primary"
              >
                {saving ? "Saving…" : "Log outfit"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
