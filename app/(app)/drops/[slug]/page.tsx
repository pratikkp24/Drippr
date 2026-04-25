import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import { SaveButton } from "@/components/drops/SaveButton";
import { ShareButton } from "@/components/drops/ShareButton";
import { ShopButton } from "@/components/drops/ShopButton";
import { CommentsSection } from "@/components/drops/CommentsSection";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const drop = await prisma.drop.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      story: true,
      user: { select: { username: true, displayName: true } }
    }
  });
  if (!drop) return { title: "Drop not found · Drippr." };

  const ogUrl = `/api/og/drop/${params.slug}`;
  return {
    title: `${drop.name} · @${drop.user.username} · Drippr.`,
    description: drop.story || `A drop by ${drop.user.displayName} on Drippr.`,
    openGraph: {
      title: drop.name,
      description: drop.story || `A drop by ${drop.user.displayName} on Drippr.`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title: drop.name,
      description: drop.story || undefined,
      images: [ogUrl]
    }
  };
}

export default async function DropDetailsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;

  const drop = await prisma.drop.findUnique({
    where: { slug },
    include: {
      user: true,
      pieces: {
        include: { piece: { include: { partner: true } } },
        orderBy: { order: "asc" }
      }
    }
  });

  if (!drop) notFound();

  const authUser = await getUser();

  let saved = false;
  if (authUser) {
    const s = await prisma.savedDrop.findUnique({
      where: { userId_dropId: { userId: authUser.id, dropId: drop.id } },
      select: { id: true }
    });
    saved = !!s;
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="fixed top-0 inset-x-0 h-[72px] sm:h-[80px] z-30 flex items-center justify-between px-md sm:px-xl pointer-events-none">
        <Link
          href="/drops"
          className="w-[44px] h-[44px] rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-auto hover:bg-white hover:text-bg transition-all"
          aria-label="Back to drops"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-sm pointer-events-auto">
          <SaveButton dropId={drop.id} initialSaved={saved} />
          <ShareButton url={`/drops/${drop.slug}`} title={drop.name} />
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[70vh] sm:h-[80vh] w-full">
        <Image
          src={drop.coverImage}
          alt={drop.name}
          fill
          priority
          className="object-cover"

        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-black/30" />
        <div className="absolute bottom-0 inset-x-0 p-md sm:p-xl flex flex-col items-center text-center">
          <span className="font-sans font-medium text-[11px] text-text-3 uppercase tracking-[0.3em] mb-sm">
            Curated drop
          </span>
          <h1 className="fraunces text-text-1 text-[clamp(40px,7vw,72px)] leading-none mb-md">
            {drop.name}
          </h1>
          <div className="flex items-center gap-md">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border">
              <Image
                src={
                  drop.user.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(drop.user.displayName)}`
                }
                alt={drop.user.displayName}
                fill
                sizes="40px"
                className="object-cover"

              />
            </div>
            <span className="font-sans font-light text-text-2 text-[15px] sm:text-[16px]">
              by{" "}
              <Link
                href={`/profile/${drop.user.username}`}
                className="font-medium text-text-1 hover:underline"
              >
                @{drop.user.username}
              </Link>
            </span>
          </div>
        </div>
      </section>

      {drop.story && (
        <section className="max-w-[700px] mx-auto px-md sm:px-xl py-2xl text-center">
          <p className="font-sans font-light text-[17px] sm:text-[20px] text-text-2 leading-relaxed italic">
            “{drop.story}”
          </p>
        </section>
      )}

      <section className="max-w-[1200px] mx-auto px-md sm:px-xl py-xl space-y-xl">
        <h2 className="font-sans font-medium text-[11px] text-text-3 uppercase tracking-[2px] border-b border-border pb-md">
          {drop.pieces.length} featured {drop.pieces.length === 1 ? "piece" : "pieces"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg sm:gap-2xl">
          {drop.pieces.map((item) => (
            <div key={item.id} className="group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface border border-border mb-lg">
                <Image
                  src={item.piece.primaryPhoto || ""}
                  alt={item.piece.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"

                />
                {item.piece.sourceUrl && (
                  <div className="absolute bottom-md right-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                    <ShopButton
                      originalUrl={item.piece.sourceUrl}
                      partnerName={item.piece.partner?.name}
                      partnerId={item.piece.partner?.id}
                      pieceId={item.piece.id}
                      dropId={drop.id}
                    />
                  </div>
                )}
              </div>
              <div className="px-sm space-y-1">
                <div className="flex items-center justify-between gap-sm">
                  <h3 className="font-sans font-medium text-[16px] sm:text-[17px] text-text-1 truncate">
                    {item.piece.name}
                  </h3>
                  {item.piece.partner && (
                    <span className="text-[11px] font-bold text-text-3 px-1.5 py-0.5 border border-border rounded shrink-0">
                      {item.piece.partner.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                {item.piece.brand && (
                  <p className="font-sans font-light text-[14px] text-text-2">{item.piece.brand}</p>
                )}
                {item.styleNote && (
                  <p className="font-sans font-light text-[13px] text-text-3 italic mt-sm border-l-2 border-border pl-sm">
                    {item.styleNote}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CommentsSection slug={drop.slug} currentUserId={authUser?.id || null} />

      <footer className="py-2xl border-t border-border mt-2xl text-center">
        <p className="fraunces text-text-3 text-[18px]">Drippr.</p>
      </footer>
    </div>
  );
}
