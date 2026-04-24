"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Drop = {
  id: string;
  slug: string;
  name: string;
  coverImage: string;
  _count: { pieces: number };
};

type DropWithCreator = Drop & {
  user: { username: string; displayName: string };
};

type Piece = {
  id: string;
  name: string;
  primaryPhoto: string | null;
  category: string;
  brand: string | null;
};

type Tab = "drops" | "closet" | "saved";

export default function ProfileTabs({
  isOwnProfile,
  drops,
  closet,
  saved,
  counts
}: {
  isOwnProfile: boolean;
  drops: Drop[];
  closet: Piece[];
  saved: DropWithCreator[];
  counts: { drops: number; closet: number; saved: number };
}) {
  const [tab, setTab] = useState<Tab>("drops");

  return (
    <>
      <nav className="max-w-[1000px] mx-auto px-xl">
        <div className="flex items-center space-x-xl border-b border-border">
          <TabButton active={tab === "drops"} onClick={() => setTab("drops")} count={counts.drops}>
            Drops
          </TabButton>
          <TabButton active={tab === "closet"} onClick={() => setTab("closet")} count={counts.closet}>
            Closet
          </TabButton>
          {isOwnProfile && (
            <TabButton active={tab === "saved"} onClick={() => setTab("saved")} count={counts.saved}>
              Saved
            </TabButton>
          )}
        </div>
      </nav>

      <main className="max-w-[1000px] mx-auto p-xl">
        {tab === "drops" && <DropsGrid drops={drops} emptyMessage={isOwnProfile ? "You haven’t published a drop yet." : "No drops published yet."} linkHref={(d) => `/drops/${d.slug}`} />}

        {tab === "closet" && (
          closet.length === 0 ? (
            <EmptyState
              title={isOwnProfile ? "Your closet is empty." : "Nothing in the closet yet."}
              subtitle={isOwnProfile ? "Add your first piece." : "Check back later."}
              ctaHref={isOwnProfile ? "/closet/add" : undefined}
              ctaLabel="Add a piece"
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
              {closet.map((p) => (
                <Link
                  key={p.id}
                  href={isOwnProfile ? `/closet/${p.id}` : "#"}
                  onClick={(e) => !isOwnProfile && e.preventDefault()}
                  className={`group ${isOwnProfile ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface border border-border mb-sm">
                    {p.primaryPhoto ? (
                      <Image
                        src={p.primaryPhoto}
                        alt={p.name}
                        fill
                        sizes="(max-width:768px) 50vw, 25vw"
                        className={`object-cover transition-transform duration-500 ${isOwnProfile ? "group-hover:scale-105" : ""}`}
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-text-3 text-[12px]">
                        No photo
                      </div>
                    )}
                  </div>
                  <p className="font-sans font-medium text-[14px] text-text-1 truncate">{p.name}</p>
                  <p className="font-sans font-light text-[12px] text-text-3 truncate">
                    {p.brand ?? p.category.toLowerCase()}
                  </p>
                </Link>
              ))}
            </div>
          )
        )}

        {tab === "saved" && isOwnProfile && (
          saved.length === 0 ? (
            <EmptyState
              title="Nothing saved yet."
              subtitle="Save drops you want to come back to."
              ctaHref="/discover"
              ctaLabel="Discover drops"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
              {saved.map((d) => (
                <Link
                  key={d.id}
                  href={`/drops/${d.slug}`}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-md shadow-sm border border-border bg-surface">
                    <Image
                      src={d.coverImage}
                      alt={d.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <h3 className="fraunces text-text-1 text-[20px]">{d.name}</h3>
                  <p className="font-sans font-light text-text-3 text-[13px]">
                    by @{d.user.username} · {d._count.pieces} pieces
                  </p>
                </Link>
              ))}
            </div>
          )
        )}
      </main>
    </>
  );
}

function TabButton({
  children,
  active,
  onClick,
  count
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-sm px-2 text-[15px] font-sans font-medium border-b-2 -mb-px transition-colors ${
        active
          ? "text-text-1 border-primary"
          : "text-text-3 hover:text-text-1 border-transparent"
      }`}
    >
      {children} <span className="text-[12px] font-light">{count}</span>
    </button>
  );
}

function DropsGrid({
  drops,
  emptyMessage,
  linkHref
}: {
  drops: Drop[];
  emptyMessage: string;
  linkHref: (d: Drop) => string;
}) {
  if (drops.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        subtitle="Build one from your closet."
        ctaHref="/drops/create"
        ctaLabel="Build a drop"
      />
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
      {drops.map((d) => (
        <Link key={d.id} href={linkHref(d)} className="group cursor-pointer">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-md shadow-sm border border-border bg-surface">
            <Image
              src={d.coverImage}
              alt={d.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          </div>
          <h3 className="fraunces text-text-1 text-[20px]">{d.name}</h3>
          <p className="font-sans font-light text-text-3 text-[13px]">
            {d._count.pieces} {d._count.pieces === 1 ? "piece" : "pieces"}
          </p>
        </Link>
      ))}
    </div>
  );
}

function EmptyState({
  title,
  subtitle,
  ctaHref,
  ctaLabel
}: {
  title: string;
  subtitle: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="text-center py-3xl max-w-[400px] mx-auto space-y-md">
      <h2 className="fraunces text-[28px] leading-[1.05] text-text-1">{title}</h2>
      <p className="font-light text-[14px] text-text-2">{subtitle}</p>
      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          className="inline-flex h-[44px] px-xl bg-primary text-bg rounded-md font-medium text-[14px] hover:bg-primary-hover transition-colors items-center"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
