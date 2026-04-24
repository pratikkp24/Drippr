"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, Loader2 } from "lucide-react";

type HomeDrop = {
  id: string;
  slug: string;
  name: string;
  story: string | null;
  coverImage: string;
  href: string;
  source: "real" | "mock";
  piecesCount: number;
  user: { username: string; displayName: string; avatarUrl: string | null; href: string };
};

type HomePiece = {
  id: string;
  name: string;
  primaryPhoto: string;
  brand: string | null;
  href: string;
  source: "real" | "mock";
  user: { username: string; displayName: string; avatarUrl: string | null; href: string };
};

type CreatorCard = {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  styleSignature: string | null;
  followerCount: number;
  href: string;
  source: "real" | "mock";
};

type HomeResponse = {
  featuredDrop: HomeDrop | null;
  creatorPicks: HomePiece[];
  trendingDrops: HomeDrop[];
  creatorsToKnow: CreatorCard[];
  hasRealContent: boolean;
};

function compactNumber(n: number) {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}m`;
}

export default function HomePage() {
  const [data, setData] = useState<HomeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHome() {
      try {
        const res = await fetch("/api/home");
        if (res.ok) setData(await res.json());
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

  const featuredDrop = data?.featuredDrop;
  const creatorPicks = data?.creatorPicks ?? [];
  const trendingDrops = data?.trendingDrops ?? [];
  const creatorsToKnow = data?.creatorsToKnow ?? [];
  const hasRealContent = data?.hasRealContent ?? false;

  return (
    <div className="min-h-screen bg-bg">
      <header className="h-[72px] sm:h-[80px] flex items-center justify-between px-md sm:px-xl border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <h1 className="fraunces text-[28px] font-semibold text-text-1">Home</h1>
        <Link href="/search">
          <Search className="w-5 h-5 text-text-3 cursor-pointer hover:text-primary transition-colors" />
        </Link>
      </header>

      <div className="p-md sm:p-xl space-y-xl sm:space-y-2xl max-w-[1200px] mx-auto">
        {!hasRealContent && (
          <div className="bg-surface border border-border rounded-lg px-md py-sm flex items-center justify-between gap-md">
            <p className="text-[13px] font-light text-text-2">
              You’re seeing sample drops and creators. <span className="italic">Build your closet</span> to see your feed fill with the real thing.
            </p>
            <Link
              href="/closet/add"
              className="shrink-0 h-[32px] px-md bg-primary text-bg rounded-full text-[12px] font-medium hover:bg-primary-hover transition-colors flex items-center"
            >
              Add a piece
            </Link>
          </div>
        )}

        {/* Featured drop */}
        {featuredDrop ? (
          <Link
            href={featuredDrop.href}
            className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl group block"
          >
            <Image
              src={featuredDrop.coverImage}
              alt={featuredDrop.name}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-xl left-xl right-xl flex items-end justify-between gap-md">
              <div className="space-y-xs min-w-0">
                <span className="font-sans font-medium text-[11px] text-white/70 uppercase tracking-[2px]">
                  {featuredDrop.source === "mock" ? "Editor’s pick" : "This week’s drop"}
                </span>
                <h2 className="fraunces text-white text-[clamp(32px,4vw,44px)] leading-tight truncate">
                  {featuredDrop.name}
                </h2>
                <p className="font-sans font-light text-white/90 text-[15px]">
                  by @{featuredDrop.user.username} · {featuredDrop.piecesCount} pieces
                </p>
              </div>
              <span className="shrink-0 h-[48px] px-xl border border-white/40 rounded-full bg-white/10 backdrop-blur-md text-white font-sans font-medium text-[14px] flex items-center gap-2 group-hover:bg-white group-hover:text-bg transition-all">
                View drop <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ) : (
          <div className="aspect-[16/9] w-full rounded-2xl bg-surface border border-dashed border-border flex items-center justify-center text-text-3">
            No featured drops yet.
          </div>
        )}

        {/* Creators to know */}
        {creatorsToKnow.length > 0 && (
          <section className="space-y-lg">
            <div className="flex items-end justify-between">
              <h3 className="font-sans font-medium text-[11px] text-text-3 uppercase tracking-[2px]">
                Creators to know
              </h3>
              <Link
                href="/search"
                className="text-[12px] text-text-2 hover:text-primary underline-offset-4 hover:underline"
              >
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              {creatorsToKnow.slice(0, 8).map((c) => (
                <Link
                  key={c.username}
                  href={c.href}
                  className="flex items-center gap-md p-sm bg-surface border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-border">
                    <Image
                      src={
                        c.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(c.displayName)}&bg=E6DDCF&color=1F3D2B`
                      }
                      alt={c.displayName}
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[14px] text-text-1 truncate">{c.displayName}</p>
                    <p className="font-light text-[12px] text-text-3 truncate italic">
                      {c.styleSignature || `@${c.username}`}
                    </p>
                    <p className="font-light text-[11px] text-text-3 mt-0.5">
                      {compactNumber(c.followerCount)} followers
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending drops */}
        {trendingDrops.length > 0 && (
          <section className="space-y-lg">
            <div className="flex items-end justify-between">
              <h3 className="font-sans font-medium text-[11px] text-text-3 uppercase tracking-[2px]">
                Trending drops
              </h3>
              <Link
                href="/drops"
                className="text-[12px] text-text-2 hover:text-primary underline-offset-4 hover:underline"
              >
                See all
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {trendingDrops.map((d) => (
                <Link key={d.id} href={d.href} className="group">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm bg-surface border border-border mb-sm">
                    <Image
                      src={d.coverImage}
                      alt={d.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <h4 className="fraunces text-text-1 text-[20px] leading-tight group-hover:text-primary transition-colors">
                    {d.name}
                  </h4>
                  <p className="font-light text-[12px] text-text-3 truncate">
                    by @{d.user.username} · {d.piecesCount} {d.piecesCount === 1 ? "piece" : "pieces"}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Creator picks */}
        {creatorPicks.length > 0 && (
          <section className="space-y-lg">
            <h3 className="font-sans font-medium text-[11px] text-text-3 uppercase tracking-[2px]">
              Creator picks
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
              {creatorPicks.map((pick) => (
                <Link key={pick.id} href={pick.href} className="group">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-md shadow-sm bg-surface">
                    {pick.primaryPhoto ? (
                      <Image
                        src={pick.primaryPhoto}
                        alt={pick.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                    ) : null}
                  </div>
                  <h4 className="font-sans font-medium text-[15px] text-text-1 group-hover:text-primary transition-colors truncate">
                    {pick.name}
                  </h4>
                  <p className="font-sans font-light text-[13px] text-text-3 truncate">
                    @{pick.user.username}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
