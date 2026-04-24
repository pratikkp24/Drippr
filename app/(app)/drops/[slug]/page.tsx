import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Share, Heart, ArrowLeft, ExternalLink } from "lucide-react";

export default async function DropDetailsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const drop = await prisma.drop.findUnique({
    where: { slug },
    include: {
      user: true,
      pieces: {
        include: {
          piece: {
            include: {
              partner: true
            }
          }
        },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!drop) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="fixed top-0 inset-x-0 h-[80px] z-30 flex items-center justify-between px-xl pointer-events-none">
        <Link href="/drops" className="w-[44px] h-[44px] rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-auto hover:bg-white hover:text-bg transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center space-x-sm pointer-events-auto">
          <button className="w-[44px] h-[44px] rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-bg transition-all">
            <Heart className="w-5 h-5" />
          </button>
          <button className="w-[44px] h-[44px] rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-bg transition-all">
            <Share className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <Image src={drop.coverImage} alt={drop.name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-black/30" />
        <div className="absolute bottom-0 inset-x-0 p-xl flex flex-col items-center text-center">
          <span className="font-sans font-medium text-[12px] text-text-3 uppercase tracking-[0.3em] mb-sm">
            Curated Drop
          </span>
          <h1 className="fraunces text-text-1 text-[56px] sm:text-[72px] leading-none mb-md">
            {drop.name}
          </h1>
          <div className="flex items-center space-x-md">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border">
              <Image 
                src={drop.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(drop.user.displayName)}`}
                alt={drop.user.displayName}
                fill
              />
            </div>
            <span className="font-sans font-light text-text-2 text-[16px]">
              by <Link href={`/profile/${drop.user.username}`} className="font-medium text-text-1 hover:underline">@{drop.user.username}</Link>
            </span>
          </div>
        </div>
      </section>

      {/* Story Section */}
      {drop.story && (
        <section className="max-w-[700px] mx-auto px-xl py-2xl text-center">
          <p className="font-sans font-light text-[20px] text-text-2 leading-relaxed italic">
            "{drop.story}"
          </p>
        </section>
      )}

      {/* Pieces Section */}
      <section className="max-w-[1200px] mx-auto px-xl py-xl space-y-xl">
        <h2 className="font-sans font-medium text-[12px] text-text-3 uppercase tracking-[0.2em] border-b border-border pb-md">
          {drop.pieces.length} Featured Pieces
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2xl">
          {drop.pieces.map((item) => (
            <div key={item.id} className="group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface border border-border mb-lg">
                <Image src={item.piece.primaryPhoto || ""} alt={item.piece.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                {item.piece.sourceUrl && (
                  <Link 
                    href={item.piece.sourceUrl} 
                    target="_blank"
                    className="absolute bottom-md right-md h-[40px] px-lg bg-white/90 backdrop-blur-md rounded-full flex items-center space-x-2 text-[13px] font-sans font-medium text-text-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                  >
                    <span>Shop</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <div className="px-sm space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-sans font-medium text-[17px] text-text-1">{item.piece.name}</h3>
                  {item.piece.partner && (
                    <span className="text-[11px] font-bold text-text-3 px-1.5 py-0.5 border border-border rounded">
                      {item.piece.partner.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="font-sans font-light text-[14px] text-text-2">{item.piece.brand}</p>
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

      <footer className="py-2xl border-t border-border mt-2xl text-center">
        <p className="fraunces text-text-3 text-[18px]">Drippr.</p>
      </footer>
    </div>
  );
}
