import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDiscoverPieces } from "@/lib/mock";
import { SignupOverlay } from "@/components/explore/SignupOverlay";
import { formatINR, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Discover pieces by category and vibe",
  description:
    "Browse curated fashion pieces from Indian and global creators. Filter by category, vibe, and brand. Shop directly from Myntra, Ajio, Zara, Uniqlo and more.",
  alternates: { canonical: "/explore/discover" },
  openGraph: {
    title: "Discover pieces — Drippr",
    description: "Browse curated fashion pieces filtered by vibe and category.",
    url: "/explore/discover"
  }
};

const CATEGORIES = ["All", "TOPS", "BOTTOMS", "DRESSES", "OUTERWEAR", "FOOTWEAR", "ACCESSORIES", "BAGS", "JEWELRY"];
const VIBES = ["All", "minimal", "street-luxe", "workwear", "monsoon", "festive", "travel"];

export default async function DiscoverPage(
  props: {
    searchParams: Promise<{ category?: string; vibe?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const pieces = getDiscoverPieces({
    category: searchParams.category,
    vibeTag: searchParams.vibe,
  });

  return (
    <div className="space-y-xl animate-screenIn pt-xl">
      <header className="space-y-lg">
        <h1 className="fraunces text-[44px] text-text-1">Discover <em className="italic">pieces.</em></h1>
        
        <div className="space-y-md">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-sm">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={{
                  pathname: "/explore/discover",
                  query: { ...searchParams, category: cat === "All" ? undefined : cat },
                }}
                className={cn(
                  "h-10 px-md flex items-center rounded-pill border text-[13px] font-medium transition-all",
                  (searchParams.category === cat || (!searchParams.category && cat === "All"))
                    ? "bg-primary border-primary text-bg"
                    : "bg-surface border-border text-text-2 hover:border-accent"
                )}
              >
                {cat === "All" ? "All categories" : cat.toLowerCase()}
              </Link>
            ))}
          </div>

          {/* Vibe Chips */}
          <div className="flex flex-wrap gap-sm">
            {VIBES.map((vibe) => (
              <Link
                key={vibe}
                href={{
                  pathname: "/explore/discover",
                  query: { ...searchParams, vibe: vibe === "All" ? undefined : vibe },
                }}
                className={cn(
                  "h-8 px-md flex items-center rounded-pill border text-[12px] font-medium transition-all",
                  (searchParams.vibe === vibe || (!searchParams.vibe && vibe === "All"))
                    ? "bg-accent border-accent text-primary"
                    : "bg-surface border-border text-text-3 hover:border-accent"
                )}
              >
                {vibe === "All" ? "All vibes" : vibe}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-lg">
        {pieces.map((piece) => (
          <div key={piece.id} className="group animate-screenIn">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-surface mb-md">
              <Image
                src={piece.primaryPhoto}
                alt={piece.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-sm right-sm">
                <SignupOverlay variant="shop">
                  <button className="h-9 px-md rounded-pill bg-bg/90 backdrop-blur shadow-sm text-primary text-[12px] font-medium hover:bg-bg transition-colors">
                    Shop
                  </button>
                </SignupOverlay>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-text-1 text-[15px] font-medium line-clamp-1">{piece.name}</h3>
              <Link 
                href={`/explore/profile/${piece.creator.username}`}
                className="text-text-3 text-[13px] hover:text-primary transition-colors inline-block"
              >
                @{piece.creator.username}
              </Link>
              <p className="text-primary font-medium text-[14px]">{formatINR(piece.price)}</p>
            </div>
          </div>
        ))}
        {pieces.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-border rounded-lg">
            <p className="text-text-3 font-light">No pieces found with these filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
