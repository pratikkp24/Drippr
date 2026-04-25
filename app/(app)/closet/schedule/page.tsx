"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, X, Loader2, Check } from "lucide-react";
import { InsightsPanel } from "@/components/closet/InsightsPanel";

type Piece = {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  primaryPhoto: string | null;
};

type OutfitPiece = { piece: { id: string; name: string; primaryPhoto: string | null; category: string } };
type ScheduledOutfit = {
  id: string;
  name: string | null;
  scheduledFor: string;
  occasion: string | null;
  timeOfDay: string | null;
  pieces: OutfitPiece[];
};

type WearLog = {
  id: string;
  wornAt: string;
  piece: { id: string; name: string; primaryPhoto: string | null; category: string } | null;
};

const OCCASIONS = ["CASUAL", "WORK", "EVENING", "TRAVEL", "FORMAL", "FESTIVE", "PARTY", "EVENT"] as const;

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}
function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function SchedulePage() {
  const today = new Date();
  const [cursor, setCursor] = useState(startOfMonth(today));
  const [selectedDay, setSelectedDay] = useState<Date>(today);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledOutfit[]>([]);
  const [logs, setLogs] = useState<WearLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"schedule" | "log">("schedule");

  const monthLabel = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });

  async function loadMonth() {
    setLoading(true);
    try {
      const from = toISODate(startOfMonth(cursor));
      const to = toISODate(endOfMonth(cursor));
      const [piecesRes, schedRes, logsRes] = await Promise.all([
        fetch("/api/user/pieces"),
        fetch(`/api/outfits/schedule?from=${from}&to=${to}`),
        fetch(`/api/wear-logs?from=${from}&to=${to}`)
      ]);
      const piecesData = piecesRes.ok ? await piecesRes.json() : [];
      const schedData = schedRes.ok ? await schedRes.json() : [];
      const logsData = logsRes.ok ? await logsRes.json() : [];
      setPieces(piecesData);
      setScheduled(schedData);
      setLogs(logsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  const days = useMemo(() => buildCalendarDays(cursor), [cursor]);

  const scheduledByDay = useMemo(() => {
    const m = new Map<string, ScheduledOutfit[]>();
    for (const o of scheduled) {
      const k = toISODate(new Date(o.scheduledFor));
      const arr = m.get(k) ?? [];
      arr.push(o);
      m.set(k, arr);
    }
    return m;
  }, [scheduled]);

  const logsByDay = useMemo(() => {
    const m = new Map<string, WearLog[]>();
    for (const l of logs) {
      const k = toISODate(new Date(l.wornAt));
      const arr = m.get(k) ?? [];
      arr.push(l);
      m.set(k, arr);
    }
    return m;
  }, [logs]);

  const selectedKey = toISODate(selectedDay);
  const daysScheduled = scheduledByDay.get(selectedKey) ?? [];
  const daysLogs = logsByDay.get(selectedKey) ?? [];

  const isPast = selectedDay < new Date(new Date().toDateString());
  const isToday = sameDay(selectedDay, today);
  const isFuture = selectedDay > today && !isToday;

  function openPicker(mode: "schedule" | "log") {
    setPickerMode(mode);
    setShowPicker(true);
  }

  async function handleSave(pieceIds: string[], occasion?: string) {
    if (pieceIds.length === 0) return;
    const body: Record<string, unknown> = { pieceIds, occasion };
    let url: string;
    if (pickerMode === "schedule") {
      url = "/api/outfits/schedule";
      body.scheduledFor = new Date(
        selectedDay.getFullYear(),
        selectedDay.getMonth(),
        selectedDay.getDate(),
        9,
        0,
        0
      ).toISOString();
    } else {
      url = "/api/wear-logs";
      body.wornAt = new Date(
        selectedDay.getFullYear(),
        selectedDay.getMonth(),
        selectedDay.getDate(),
        12,
        0,
        0
      ).toISOString();
    }
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      setShowPicker(false);
      loadMonth();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Failed to save");
    }
  }

  async function handleRemoveScheduled(outfitId: string) {
    if (!confirm("Remove this scheduled outfit?")) return;
    const res = await fetch(`/api/outfits/schedule?id=${outfitId}`, { method: "DELETE" });
    if (res.ok) loadMonth();
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="h-[80px] flex items-center px-xl border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <Link href="/closet" className="mr-md text-text-3 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="fraunces text-[26px] text-text-1">Wearing schedule</h1>
          <p className="font-light text-[12px] text-text-3">Plan outfits. Log what you wore.</p>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto p-xl grid lg:grid-cols-[1fr_360px] gap-xl">
        {/* Calendar */}
        <section className="space-y-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="w-9 h-9 rounded-full border border-border hover:border-primary flex items-center justify-center text-text-2 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="fraunces text-[24px] text-text-1">{monthLabel}</h2>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="w-9 h-9 rounded-full border border-border hover:border-primary flex items-center justify-center text-text-2 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
              <div key={w} className="text-[11px] font-medium text-text-3 py-sm uppercase tracking-wider">
                {w}
              </div>
            ))}
            {days.map((d, i) => {
              const key = toISODate(d);
              const isCurrentMonth = d.getMonth() === cursor.getMonth();
              const hasScheduled = scheduledByDay.has(key);
              const hasLog = logsByDay.has(key);
              const isSelected = sameDay(d, selectedDay);
              const isTodayCell = sameDay(d, today);
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(d)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg border transition-all relative ${
                    isSelected
                      ? "border-primary bg-primary text-bg"
                      : isCurrentMonth
                      ? "border-border bg-surface text-text-1 hover:border-accent"
                      : "border-transparent bg-transparent text-text-3"
                  }`}
                >
                  <span
                    className={`text-[14px] font-medium ${
                      isTodayCell && !isSelected ? "underline underline-offset-4 decoration-primary" : ""
                    }`}
                  >
                    {d.getDate()}
                  </span>
                  <div className="absolute bottom-1.5 flex gap-1">
                    {hasScheduled && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-bg" : "bg-accent"}`} />
                    )}
                    {hasLog && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-bg" : "bg-primary"}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-md text-[11px] text-text-3">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> planned
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> worn
            </span>
          </div>
        </section>

        {/* Day panel */}
        <aside className="space-y-lg">
          <div>
            <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-xs">
              {isToday ? "Today" : isPast ? "Past" : "Upcoming"}
            </p>
            <h2 className="fraunces text-[28px] text-text-1">
              {selectedDay.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric"
              })}
            </h2>
          </div>

          {loading && (
            <div className="py-xl flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-text-3" />
            </div>
          )}

          {!loading && (
            <>
              {daysScheduled.length === 0 && daysLogs.length === 0 && (
                <p className="text-[13px] font-light text-text-3 italic">
                  Nothing {isPast ? "logged" : "planned"} yet.
                </p>
              )}

              {daysScheduled.length > 0 && (
                <div className="space-y-sm">
                  <p className="text-[11px] tracking-[2px] uppercase text-text-3">Planned</p>
                  {daysScheduled.map((o) => (
                    <OutfitCard
                      key={o.id}
                      pieces={o.pieces.map((p) => p.piece)}
                      subtitle={o.occasion ? humanize(o.occasion) : "Outfit"}
                      onRemove={() => handleRemoveScheduled(o.id)}
                    />
                  ))}
                </div>
              )}

              {daysLogs.length > 0 && (
                <div className="space-y-sm">
                  <p className="text-[11px] tracking-[2px] uppercase text-text-3">Worn</p>
                  <OutfitCard
                    pieces={daysLogs.filter((l) => l.piece).map((l) => l.piece!)}
                    subtitle={`${daysLogs.length} ${daysLogs.length === 1 ? "piece" : "pieces"}`}
                  />
                </div>
              )}

              <div className="flex flex-col gap-sm pt-sm">
                {!isPast && (
                  <button
                    onClick={() => openPicker("schedule")}
                    className="h-12 rounded-md bg-surface border border-border hover:border-primary text-[14px] font-medium text-text-1 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Plan an outfit
                  </button>
                )}
                <button
                  onClick={() => openPicker("log")}
                  className="h-12 rounded-md bg-primary text-bg text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors"
                >
                  <Check className="w-4 h-4" /> Log what was worn
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      <div className="max-w-[1100px] mx-auto px-xl pb-3xl">
        <InsightsPanel monthAnchor={cursor} />
      </div>

      {showPicker && (
        <PiecePickerSheet
          pieces={pieces}
          mode={pickerMode}
          onClose={() => setShowPicker(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function humanize(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ");
}

function buildCalendarDays(cursor: Date): Date[] {
  const start = startOfMonth(cursor);
  // Monday-first grid
  const dayOfWeek = (start.getDay() + 6) % 7;
  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - dayOfWeek);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }
  return days;
}

function OutfitCard({
  pieces,
  subtitle,
  onRemove
}: {
  pieces: { id: string; name: string; primaryPhoto: string | null; category: string }[];
  subtitle: string;
  onRemove?: () => void;
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-sm">
      <div className="flex items-center justify-between mb-sm">
        <p className="text-[12px] font-medium text-text-2">{subtitle}</p>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-text-3 hover:text-error transition-colors"
            aria-label="Remove"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="flex gap-1">
        {pieces.slice(0, 5).map((p) => (
          <div
            key={p.id}
            className="relative w-12 h-12 rounded bg-bg overflow-hidden border border-border"
          >
            {p.primaryPhoto ? (
              <Image src={p.primaryPhoto} alt={p.name} fill className="object-cover" />
            ) : null}
          </div>
        ))}
        {pieces.length > 5 && (
          <div className="w-12 h-12 rounded bg-bg border border-border flex items-center justify-center text-[11px] text-text-3">
            +{pieces.length - 5}
          </div>
        )}
      </div>
    </div>
  );
}

function PiecePickerSheet({
  pieces,
  mode,
  onClose,
  onSave
}: {
  pieces: Piece[];
  mode: "schedule" | "log";
  onClose: () => void;
  onSave: (pieceIds: string[], occasion?: string) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [occasion, setOccasion] = useState<string>("");
  const [saving, setSaving] = useState(false);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function submit() {
    setSaving(true);
    await onSave(Array.from(selected), occasion || undefined);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-lg">
      <div className="w-full sm:max-w-[640px] bg-bg sm:rounded-xl border border-border max-h-[90vh] flex flex-col">
        <header className="px-lg py-md border-b border-border flex items-center justify-between">
          <h2 className="fraunces text-[22px]">
            {mode === "schedule" ? "Plan an outfit" : "Log what you wore"}
          </h2>
          <button onClick={onClose} className="text-text-3 hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-lg space-y-lg">
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
            <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-sm">
              Pick pieces ({selected.size})
            </p>
            {pieces.length === 0 ? (
              <p className="text-[13px] font-light text-text-3 italic py-md">
                Your closet is empty. Add pieces first.
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
        </div>

        <footer className="px-lg py-md border-t border-border flex items-center gap-sm">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-md border border-border text-[14px] font-medium text-text-2 hover:border-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={selected.size === 0 || saving}
            className="flex-[2] h-12 rounded-md bg-primary text-bg text-[14px] font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:hover:bg-primary"
          >
            {saving ? "Saving…" : mode === "schedule" ? "Save plan" : "Log outfit"}
          </button>
        </footer>
      </div>
    </div>
  );
}
