import Link from "next/link";
import Image from "next/image";
import { getHomeFeed, MOCK_CREATORS, MOCK_DROPS } from "@/lib/mock";
import { SignupOverlay } from "@/components/explore/SignupOverlay";
import { formatINR } from "@/lib/utils";

export default function ExploreHomePage() {
  const { featuredDrop, creatorPicks } = getHomeFeed();
  const trendingDrops = MOCK_DROPS.slice(0, 6);

  return (
    <div className="space-y-3xl animate-screenIn pt-xl">
      {/* Hero: Featured Drop */}
      <section className="relative h-[600px] rounded-xl overflow-hidden group">
        <Image
          src={featuredDrop.coverImage}
          alt={featuredDrop.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
        <div className="absolute bottom-xl left-xl right-xl">
          <p className="text-[12px] tracking-[2px] uppercase text-bg/80 mb-sm">
            Featured drop
          </p>
          <h1 className="fraunces text-[clamp(44px,7vw,84px)] leading-[1.02] text-bg mb-lg">
            {featuredDrop.name.split(" ").slice(0, -1).join(" ")}{" "}
            <em className="italic">{featuredDrop.name.split(" ").pop()}</em>
          </h1>
          <div className="flex items-center gap-lg">
            <Link 
              href={`/explore/drops/${featuredDrop.slug}`}
              className="h-[54px] px-xl inline-flex items-center rounded-md bg-bg text-primary text-[15px] font-medium hover:bg-surface transition-colors"
            >
              View drop
            </Link>
            <Link 
              href={`/explore/profile/${featuredDrop.creator.username}`}
              className="text-bg/90 text-[15px] hover:text-bg transition-colors"
            >
              by @{featuredDrop.creator.username}
            </Link>
          </div>
        </div>
      </section>

      {/* Creators Horizontal Scroll */}
      <section>
        <div className="flex items-end justify-between mb-lg">
          <h2 className="fraunces text-3xl text-text-1">Creators you should <em className="italic">know.</em></h2>
        </div>
        <div className="flex gap-lg overflow-x-auto pb-lg -mx-lg px-lg scrollbar-hide">
          {MOCK_CREATORS.map((creator) => (
            <Link 
              key={creator.id}
              href={`/explore/profile/${creator.username}`}
              className="flex-shrink-0 w-[260px] bg-surface p-lg rounded-lg border border-border hover:border-accent transition-all group"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden mb-md border-2 border-bg group-hover:border-accent transition-colors">
                <Image
                  src={creator.avatarUrl}
                  alt={creator.displayName}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-semibold text-text-1 text-[16px] mb-xs">{creator.displayName}</p>
              <p className="text-text-3 text-[13px] mb-md lowercase italic">{creator.styleSignature}</p>
              <p className="text-text-2 text-[14px] line-clamp-2 min-h-[40px] mb-md leading-relaxed">
                {creator.bio}
              </p>
              <p className="text-[12px] text-text-3 uppercase tracking-wider">
                {creator.followerCount.toLocaleString()} followers
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Drops Grid */}
      <section>
        <div className="flex items-end justify-between mb-lg">
          <h2 className="fraunces text-3xl text-text-1">Trending <em className="italic">drops.</em></h2>
          <Link href="/explore/discover" className="text-[14px] text-text-2 hover:text-primary transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {trendingDrops.map((drop) => (
            <Link 
              key={drop.id}
              href={`/explore/drops/${drop.slug}`}
              className="group relative aspect-[16/9] rounded-lg overflow-hidden border border-border"
            >
              <Image
                src={drop.coverImage}
                alt={drop.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              <div className="absolute bottom-md left-md">
                <h3 className="fraunces text-xl text-bg mb-1">{drop.name}</h3>
                <p className="text-bg/80 text-[13px]">by @{MOCK_CREATORS.find(c => c.id === drop.creatorId)?.username}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Discover Pieces Grid */}
      <section>
        <div className="flex items-end justify-between mb-lg">
          <h2 className="fraunces text-3xl text-text-1">Discover <em className="italic">pieces.</em></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
          {creatorPicks.slice(0, 12).map((piece) => (
            <div key={piece.id} className="group">
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
                <p className="text-text-3 text-[13px]">@{piece.user?.username}</p>
                <p className="text-primary font-medium text-[14px]">{formatINR(piece.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
