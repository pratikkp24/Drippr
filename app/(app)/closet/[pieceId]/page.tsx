import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";
import { formatINR } from "@/lib/utils";
import { ArchiveButton } from "./archive-button";

export default async function PieceDetailPage(props: { params: Promise<{ pieceId: string }> }) {
  const params = await props.params;
  const user = await getUser();
  if (!user) notFound();

  const piece = await prisma.piece.findFirst({
    where: { id: params.pieceId, userId: user.id },
    include: {
      partner: true,
      _count: { select: { wearLogs: true } },
      wearLogs: {
        orderBy: { wornAt: "desc" },
        take: 6,
        select: { id: true, wornAt: true, occasion: true, feeling: true }
      }
    }
  });

  if (!piece) notFound();

  const lastWorn = piece.wearLogs[0]?.wornAt ?? null;
  const cpw =
    piece.purchasePrice && piece._count.wearLogs > 0
      ? Number(piece.purchasePrice) / piece._count.wearLogs
      : null;

  return (
    <div className="min-h-screen bg-bg">
      <header className="h-[80px] flex items-center px-xl border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <Link href="/closet" className="mr-md text-text-3 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="fraunces text-[22px]">{piece.name}</h1>
      </header>

      <div className="max-w-[1000px] mx-auto p-xl grid md:grid-cols-2 gap-xl">
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface border border-border">
          {piece.primaryPhoto ? (
            <Image src={piece.primaryPhoto} alt={piece.name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-3 text-sm">
              No photo
            </div>
          )}
        </div>

        <section className="space-y-lg">
          <div>
            <p className="text-[11px] tracking-[2px] uppercase text-text-3">
              {piece.category.toLowerCase()}
              {piece.brand ? ` · ${piece.brand}` : ""}
            </p>
            <h2 className="fraunces text-[36px] leading-[1.05] mt-xs">{piece.name}</h2>
          </div>

          <div className="grid grid-cols-3 gap-sm">
            <Stat label="Wears" value={String(piece._count.wearLogs)} />
            <Stat label="Last worn" value={formatLastWorn(lastWorn)} />
            <Stat label="Cost per wear" value={cpw ? formatINR(cpw) : "—"} />
          </div>

          {piece.styleNotes && (
            <div className="bg-surface rounded-lg p-md border border-border">
              <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-xs">Notes</p>
              <p className="text-[14px] italic text-text-1">{piece.styleNotes}</p>
            </div>
          )}

          <div className="flex gap-sm">
            {piece.sourceUrl && (
              <a
                href={piece.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-12 rounded-md bg-primary text-bg text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors"
              >
                Shop {piece.partner?.name ? `on ${piece.partner.name}` : ""}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <ArchiveButton pieceId={piece.id} />
          </div>

          {piece.wearLogs.length > 0 && (
            <div className="pt-md">
              <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-sm">Recent wears</p>
              <ul className="space-y-1.5">
                {piece.wearLogs.map((w) => (
                  <li
                    key={w.id}
                    className="flex items-center justify-between text-[13px] py-1.5 border-b border-border/60 last:border-b-0"
                  >
                    <span className="text-text-1">
                      {new Date(w.wornAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                    <span className="text-text-3 text-[12px]">
                      {[w.occasion, w.feeling].filter(Boolean).map(humanize).join(" · ") || "logged"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function humanize(s: string | null) {
  if (!s) return "";
  return s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ");
}

function formatLastWorn(iso: Date | string | null) {
  if (!iso) return "Never";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface rounded-lg p-sm border border-border text-center">
      <p className="text-[10px] tracking-widest uppercase text-text-3">{label}</p>
      <p className="font-medium text-[15px] text-text-1 mt-0.5">{value}</p>
    </div>
  );
}
