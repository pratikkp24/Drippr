"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Calendar as CalendarIcon, Loader2 } from "lucide-react";

const CATEGORIES = [
  { label: "All", value: "ALL" },
  { label: "Tops", value: "TOPS" },
  { label: "Bottoms", value: "BOTTOMS" },
  { label: "Dresses", value: "DRESSES" },
  { label: "Outerwear", value: "OUTERWEAR" },
  { label: "Footwear", value: "FOOTWEAR" },
  { label: "Accessories", value: "ACCESSORIES" }
];

type Piece = {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  primaryPhoto: string | null;
  partner: { name: string; slug: string } | null;
  wearCount: number;
  lastWornAt: string | null;
  createdAt: string;
};

function relativeTime(iso: string | null) {
  if (!iso) return "Never worn";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} wks ago`;
  if (days < 365) return `${Math.floor(days / 30)} mo ago`;
  return `${Math.floor(days / 365)} yr ago`;
}

function partnerTag(slug: string | null | undefined): string {
  if (!slug) return "OWN";
  const map: Record<string, string> = {
    myntra: "MN",
    ajio: "AJ",
    "nykaa-fashion": "NF",
    zara: "ZA",
    uniqlo: "UQ",
    hm: "HM",
    mango: "MG",
    aritzia: "AR",
    asos: "AS",
    westside: "WS",
    souledstore: "SS",
    snitch: "SN"
  };
  return map[slug] ?? slug.slice(0, 2).toUpperCase();
}

export default function ClosetPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [pieces, setPieces] = useState<Piece[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let abort = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/user/pieces?category=${activeCategory}`);
        if (!res.ok) throw new Error("load failed");
        const data: Piece[] = await res.json();
        if (!abort) setPieces(data);
      } catch (err) {
        if (!abort) setError("Couldn't load your closet.");
        console.error(err);
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => {
      abort = true;
    };
  }, [activeCategory]);

  const counts = useMemo(() => {
    if (!pieces) return null;
    const total = pieces.length;
    const worn = pieces.reduce((n, p) => n + p.wearCount, 0);
    return { total, worn };
  }, [pieces]);

  return (
    <div className="min-h-screen bg-bg">
      <header className="h-[72px] sm:h-[80px] flex items-center justify-between px-md sm:px-xl border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20 gap-md">
        <div className="min-w-0">
          <h1 className="fraunces text-[22px] sm:text-[28px] font-semibold text-text-1 truncate">My closet</h1>
          {counts && (
            <p className="font-light text-[11px] sm:text-[12px] text-text-3 truncate">
              {counts.total} {counts.total === 1 ? "piece" : "pieces"} · {counts.worn} wears logged
            </p>
          )}
        </div>
        <div className="flex items-center gap-sm sm:gap-md shrink-0">
          <Link
            href="/closet/schedule"
            className="h-9 sm:h-[36px] px-sm sm:px-lg border border-border rounded-full font-sans font-medium text-[12px] sm:text-[13px] text-text-1 hover:bg-surface transition-colors flex items-center gap-1 sm:gap-2"
            aria-label="Schedule"
          >
            <CalendarIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Schedule</span>
          </Link>
          <Link
            href="/closet/add"
            className="h-9 sm:h-[36px] px-sm sm:px-lg bg-primary text-bg rounded-full font-sans font-medium text-[12px] sm:text-[13px] hover:bg-primary-hover transition-colors flex items-center gap-1 sm:gap-2"
            aria-label="Add piece"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add piece</span>
          </Link>
          <Link href="/search" className="hidden sm:block" aria-label="Search">
            <Search className="w-5 h-5 text-text-3 hover:text-primary transition-colors" />
          </Link>
        </div>
      </header>

      <div className="p-md sm:p-xl space-y-lg sm:space-y-xl max-w-[1400px] mx-auto">
        <div className="flex items-center space-x-sm overflow-x-auto pb-md">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-lg h-[38px] rounded-full font-sans font-medium text-[13px] whitespace-nowrap transition-all border ${
                activeCategory === cat.value
                  ? "bg-primary text-bg border-primary"
                  : "bg-surface text-text-2 border-border hover:border-text-3"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="py-3xl flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-text-3" />
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-[13px] text-error py-xl">{error}</p>
        )}

        {!loading && !error && pieces && pieces.length === 0 && (
          <div className="text-center py-3xl max-w-[400px] mx-auto space-y-md">
            <h2 className="fraunces text-[32px] leading-[1.05] text-text-1">
              Your closet is <em className="italic">empty.</em>
            </h2>
            <p className="font-light text-[15px] text-text-2">
              Paste a Myntra, Ajio, or Zara link — or upload a photo.
            </p>
            <div className="pt-sm">
              <Link
                href="/closet/add"
                className="inline-flex h-[48px] px-xl bg-primary text-bg rounded-md font-medium text-[14px] hover:bg-primary-hover transition-colors items-center"
              >
                Add your first piece
              </Link>
            </div>
          </div>
        )}

        {!loading && pieces && pieces.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md sm:gap-xl">
            {pieces.map((piece) => (
              <Link
                href={`/closet/${piece.id}`}
                key={piece.id}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-lg shadow-sm bg-surface">
                  {piece.primaryPhoto ? (
                    <Image
                      src={piece.primaryPhoto}
                      alt={piece.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"

                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-text-3 text-[12px]">
                      No photo
                    </div>
                  )}
                  <div className="absolute bottom-md left-md bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-text-1">
                    {partnerTag(piece.partner?.slug)}
                  </div>
                </div>
                <div className="px-sm space-y-1">
                  <h4 className="font-sans font-medium text-[15px] text-text-1 truncate">
                    {piece.name}
                  </h4>
                  <p className="font-sans font-light text-[12px] text-text-3 italic">
                    {piece.wearCount} {piece.wearCount === 1 ? "wear" : "wears"} · {relativeTime(piece.lastWornAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
