import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCreatorByUsername, getCreatorProfile, MOCK_PIECES } from "@/lib/mock";
import { SignupOverlay } from "@/components/explore/SignupOverlay";
import { MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ProfilePage(
  props: { 
    params: Promise<{ username: string }>;
    searchParams: Promise<{ tab?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const data = getCreatorProfile(params.username);

  if (!data) {
    notFound();
  }

  const { creator, drops } = data;
  const activeTab = searchParams.tab || "drops";

  return (
    <div className="animate-screenIn pt-2xl space-y-2xl">
      {/* Header */}
      <header className="flex flex-col md:flex-row gap-xl items-start">
        <div className="relative w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden border-4 border-surface shadow-sm">
          <Image
            src={creator.avatarUrl}
            alt={creator.displayName}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 space-y-lg">
          <div className="space-y-sm">
            <div className="flex items-center justify-between gap-xl">
              <h1 className="fraunces text-4xl text-text-1">{creator.displayName}</h1>
              <SignupOverlay variant="follow">
                <button className="h-11 px-lg rounded-pill bg-primary text-bg text-[14px] font-medium hover:bg-primary-hover transition-colors">
                  Follow
                </button>
              </SignupOverlay>
            </div>
            <p className="text-text-3 text-[18px]">@{creator.username}</p>
          </div>

          <div className="space-y-md">
            <p className="text-[18px] text-text-2 font-light leading-relaxed max-w-[600px]">
              {creator.bio}
            </p>
            <p className="text-primary italic font-medium">
              {creator.styleSignature}
            </p>
          </div>

          <div className="flex flex-wrap gap-xl pt-md">
            <div className="flex items-center gap-sm text-text-3 text-[14px]">
              <MapPin size={16} />
              <span>{creator.location}</span>
            </div>
            <div className="flex items-center gap-sm text-text-3 text-[14px]">
              <Users size={16} />
              <span>{creator.followerCount.toLocaleString()} followers</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <section className="space-y-xl">
        <div className="flex border-b border-border">
          <Link
            href={{ query: { tab: "drops" } }}
            className={cn(
              "h-12 px-xl flex items-center text-[14px] font-medium transition-colors relative",
              activeTab === "drops" ? "text-primary" : "text-text-3 hover:text-text-1"
            )}
          >
            Drops
            {activeTab === "drops" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </Link>
          <Link
            href={{ query: { tab: "closet" } }}
            className={cn(
              "h-12 px-xl flex items-center text-[14px] font-medium transition-colors relative",
              activeTab === "closet" ? "text-primary" : "text-text-3 hover:text-text-1"
            )}
          >
            Closet
            {activeTab === "closet" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </Link>
        </div>

        {activeTab === "drops" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {drops.map((drop) => (
              <Link 
                key={drop.id}
                href={`/explore/drops/${drop.slug}`}
                className="group relative aspect-video rounded-lg overflow-hidden border border-border"
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
                  <div className="flex gap-sm">
                    {drop.vibeTags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[11px] uppercase tracking-wider text-bg/70 bg-bg/10 backdrop-blur-sm px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Blurred Preview for Closet */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-md opacity-20 blur-sm select-none pointer-events-none">
               {MOCK_PIECES.slice(0, 12).map((p, i) => (
                 <div key={i} className="aspect-[3/4] bg-surface rounded-lg" />
               ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-bg/80 backdrop-blur p-xl rounded-xl border border-border shadow-xl text-center max-w-[360px]">
                <h3 className="fraunces text-2xl text-text-1 mb-md">Unlock pieces.</h3>
                <p className="text-text-2 text-[14px] mb-lg leading-relaxed">
                  Sign up to see {creator.displayName}'s full closet and shop pieces they love.
                </p>
                <SignupOverlay variant="follow">
                  <button className="h-12 w-full rounded-md bg-primary text-bg font-medium hover:bg-primary-hover transition-colors">
                    Sign up to see closet
                  </button>
                </SignupOverlay>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
