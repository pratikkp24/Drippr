import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDropBySlug, getCreatorProfile } from "@/lib/mock";
import { SignupOverlay } from "@/components/explore/SignupOverlay";
import { formatINR } from "@/lib/utils";

export default function DropPage({ params }: { params: { slug: string } }) {
  const data = getDropBySlug(params.slug);

  if (!data) {
    notFound();
  }

  // data IS the drop, so we just extract creator and pieces
  const { creator, pieces } = data;
  const profileData = getCreatorProfile(creator.username);
  const otherDrops = profileData?.drops.filter(d => d.id !== data.id).slice(0, 3) || [];

  return (
    <div className="animate-screenIn pt-xl space-y-2xl">
      {/* Hero */}
      <section className="relative aspect-[16/9] w-full max-w-[1200px] rounded-xl overflow-hidden shadow-sm">
        <Image
          src={data.coverImage}
          alt={data.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        <div className="absolute bottom-lg left-lg right-lg flex items-end justify-between">
          <div>
            <h1 className="fraunces text-[clamp(32px,5vw,64px)] text-bg leading-tight mb-2">
              {data.name}
            </h1>
            <Link 
              href={`/explore/profile/${creator.username}`}
              className="text-bg/80 hover:text-bg transition-colors text-[16px]"
            >
              by @{creator.username}
            </Link>
          </div>
          <SignupOverlay variant="save">
            <button className="h-[54px] px-xl rounded-md bg-bg text-primary font-medium hover:bg-surface transition-colors shadow-lg">
              Save drop
            </button>
          </SignupOverlay>
        </div>
      </section>

      {/* Story & Tags */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-xl">
        <div className="md:col-span-2 space-y-md">
          <h2 className="text-[12px] uppercase tracking-[0.2em] text-text-3">The story</h2>
          <p className="text-[20px] text-text-2 font-light leading-relaxed max-w-[640px]">
            {data.story}
          </p>
        </div>
        <div className="space-y-md">
           <h2 className="text-[12px] uppercase tracking-[0.2em] text-text-3">Vibes</h2>
           <div className="flex flex-wrap gap-sm">
              {data.vibeTags.map(tag => (
                <span key={tag} className="h-8 px-md flex items-center rounded-pill bg-surface border border-border text-[12px] text-text-2">
                  {tag}
                </span>
              ))}
           </div>
           <h2 className="text-[12px] uppercase tracking-[0.2em] text-text-3 mt-lg">Season</h2>
           <div className="flex flex-wrap gap-sm">
              {data.season.map(s => (
                <span key={s} className="h-8 px-md flex items-center rounded-pill bg-surface border border-border text-[12px] text-text-2">
                  {s.toLowerCase()}
                </span>
              ))}
           </div>
        </div>
      </section>

      {/* Pieces Grid */}
      <section className="space-y-lg pt-xl border-t border-border">
        <h2 className="fraunces text-3xl text-text-1">Collection <em className="italic">pieces.</em></h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-lg">
          {pieces.map((piece) => (
            <div key={piece.id} className="group flex flex-col">
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
              <div className="mt-auto space-y-1">
                <h3 className="text-text-1 text-[16px] font-medium">{piece.name}</h3>
                <p className="text-text-3 text-[14px]">{piece.brand}</p>
                <div className="flex items-center justify-between pt-1">
                  <p className="text-primary font-semibold text-[15px]">{formatINR(piece.price)}</p>
                  <span className="text-[11px] text-text-3 font-medium uppercase tracking-wider px-2 py-0.5 rounded border border-border">
                    {piece.partnerSlug}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* More from Creator */}
      {otherDrops.length > 0 && (
        <section className="space-y-lg pt-2xl">
          <h2 className="fraunces text-2xl text-text-1">More from <em className="italic">@{creator.username}</em></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {otherDrops.map((otherDrop) => (
              <Link
                key={otherDrop.id}
                href={`/explore/drops/${otherDrop.slug}`}
                className="group relative aspect-video rounded-lg overflow-hidden border border-border"
              >
                <Image
                  src={otherDrop.coverImage}
                  alt={otherDrop.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-md left-md">
                  <h3 className="fraunces text-lg text-bg leading-tight">{otherDrop.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
