"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, Loader2 } from "lucide-react";

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHome() {
      try {
        const res = await fetch("/api/home");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHome();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-text-3" />
      </div>
    );
  }

  const { featuredDrop, creatorPicks } = data || {};

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="h-[80px] flex items-center justify-between px-xl border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <h1 className="fraunces text-[28px] font-semibold text-text-1">Home</h1>
        <div className="relative">
          <Link href="/search">
            <Search className="w-5 h-5 text-text-3 cursor-pointer hover:text-primary transition-colors" />
          </Link>
        </div>
      </header>

      <div className="p-xl space-y-2xl max-w-[1200px] mx-auto">
        {/* Hero Section */}
        {featuredDrop ? (
          <section className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
            <Image
              src={featuredDrop.coverImage}
              alt={featuredDrop.name}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-xl left-xl right-xl flex items-end justify-between">
              <div className="space-y-xs">
                <span className="font-sans font-medium text-[12px] text-white/70 uppercase tracking-[0.2em]">
                  This week's drop
                </span>
                <h2 className="fraunces text-white text-[44px] leading-tight">
                  {featuredDrop.name}
                </h2>
                <p className="font-sans font-light text-white/90 text-[15px]">
                  by @{featuredDrop.user.username}
                </p>
              </div>
              
              <Link 
                href={`/drops/${featuredDrop.slug}`}
                className="flex items-center space-x-2 h-[48px] px-xl border border-white/40 rounded-full bg-white/10 backdrop-blur-md text-white font-sans font-medium text-[14px] hover:bg-white hover:text-bg transition-all"
              >
                <span>View Drop</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        ) : (
          <div className="aspect-[16/9] w-full rounded-2xl bg-surface border border-dashed border-border flex items-center justify-center text-text-3">
             No featured drops yet.
          </div>
        )}

        {/* Creator Picks */}
        {creatorPicks && creatorPicks.length > 0 && (
          <section className="space-y-lg">
            <h3 className="font-sans font-medium text-[12px] text-text-3 uppercase tracking-[0.2em]">
              Creator Picks
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
              {creatorPicks.map((pick: any) => (
                <div key={pick.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-md shadow-sm bg-surface">
                    <Image
                      src={pick.primaryPhoto}
                      alt={pick.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                  <h4 className="font-sans font-medium text-[15px] text-text-1 group-hover:text-primary transition-colors truncate">
                    {pick.name}
                  </h4>
                  <p className="font-sans font-light text-[13px] text-text-3 truncate">@{pick.user.username}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
