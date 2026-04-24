"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";

export default function DropsPage() {
  const [drops, setDrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDrops() {
      try {
        const res = await fetch("/api/drops/list");
        if (res.ok) {
          const data = await res.json();
          setDrops(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDrops();
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="h-[80px] flex items-center justify-between px-xl border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <h1 className="fraunces text-[28px] font-semibold text-text-1">Drops</h1>
        <Link href="/search">
          <Search className="w-5 h-5 text-text-3 cursor-pointer hover:text-primary transition-colors" />
        </Link>
      </header>

      <div className="p-xl max-w-[1000px] mx-auto space-y-lg">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-text-3" />
          </div>
        ) : drops.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="fraunces text-text-2 text-[24px]">No drops yet.</h2>
            <p className="text-text-3 mt-2">Become the first to publish a drop!</p>
          </div>
        ) : drops.map((drop) => (
          <Link 
            key={drop.id} 
            href={`/drops/${drop.slug}`}
            className="block relative p-lg bg-surface border border-border rounded-2xl group hover:border-primary transition-all overflow-hidden"
          >
            <div className="flex space-x-xl">
              {/* Image side */}
              <div className="relative w-[180px] aspect-square rounded-xl overflow-hidden shrink-0">
                <Image
                  src={drop.coverImage}
                  alt={drop.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
              </div>

              {/* Content side */}
              <div className="flex-1 py-sm flex flex-col justify-between">
                <div>
                  <span className="font-sans font-medium text-[11px] text-text-3 uppercase tracking-[0.2em] mb-sm block">
                    DROP • {drop._count.pieces} PIECES
                  </span>
                  <h2 className="fraunces text-text-1 text-[28px] leading-tight mb-xs">
                    {drop.name}
                  </h2>
                  <p className="font-sans font-light text-text-2 text-[15px] leading-relaxed max-w-[400px] line-clamp-2">
                    {drop.story}
                  </p>
                </div>

                <div className="flex items-center space-x-md">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                    <Image
                      src={drop.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(drop.user.displayName)}`}
                      alt={drop.user.displayName}
                      fill
                    />
                  </div>
                  <span className="font-sans font-light text-text-2 text-[13px]">
                    by @{drop.user.username}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
