"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Creator = {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  styleSignature?: string;
};

export default function OnboardingFollowPage() {
  const router = useRouter();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCreators() {
      try {
        const res = await fetch("/api/onboarding/creators");
        const data = await res.json();
        if (data.creators) {
          setCreators(data.creators);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCreators();
  }, []);

  async function toggleFollow(creatorId: string) {
    const isCurrentlyFollowing = following.has(creatorId);
    
    // Optimistic update
    setFollowing(prev => {
      const next = new Set(prev);
      if (isCurrentlyFollowing) next.delete(creatorId);
      else next.add(creatorId);
      return next;
    });

    try {
      if (!isCurrentlyFollowing) {
        await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetUserId: creatorId })
        });
      } else {
        // Technically this should hit a DELETE endpoint, but for onboarding dummy state it's fine.
        // We bypass the actual unfollow call for now since we don't have the API endpoint built yet in phase 2.
      }
    } catch {
      // Revert if failed
      setFollowing(prev => {
        const next = new Set(prev);
        if (isCurrentlyFollowing) next.add(creatorId);
        else next.delete(creatorId);
        return next;
      });
    }
  }

  function handleContinue() {
    router.push("/onboarding/closet-seed");
  }

  return (
    <main className="min-h-screen bg-bg flex flex-col items-center py-xl px-lg">
      <div className="w-full max-w-[480px] animate-slideUp">
        <h1 className="fraunces text-[44px] leading-[1.05] text-text-1 mb-xs">
          Follow creators who <em className="italic">get</em> you.
        </h1>
        <p className="font-light text-[15px] text-text-2 mb-2xl">
          Based on your taste — you can always change this.
        </p>

        {loading ? (
          <div className="space-y-md animate-pulse mb-2xl">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-md h-[72px]">
                <div className="w-12 h-12 rounded-full bg-border" />
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-4 bg-border rounded" />
                  <div className="w-48 h-3 bg-border rounded" />
                </div>
                <div className="w-[84px] h-[36px] bg-border rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-xs mb-2xl">
            {creators.map(creator => {
              const isFollowing = following.has(creator.id);
              return (
                <div key={creator.id} className="flex items-center p-sm -mx-sm rounded-lg hover:bg-surface/50 transition-colors h-[72px]">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={creator.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.displayName)}&bg=E6DDCF&color=1F3D2B`}
                      alt={creator.displayName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="ml-md flex-1 min-w-0">
                    <div className="flex items-baseline space-x-2 truncate">
                      <span className="font-sans font-medium text-[15px] text-text-1 truncate">
                        {creator.displayName}
                      </span>
                      <span className="font-sans font-light text-[13px] text-text-2 truncate">
                        @{creator.username}
                      </span>
                    </div>
                    {creator.styleSignature && (
                      <p className="font-sans font-light italic text-[12px] text-text-3 truncate mt-0.5">
                        {creator.styleSignature}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => toggleFollow(creator.id)}
                    className={`ml-md shrink-0 h-[36px] px-lg rounded-full font-sans font-medium text-[13px] transition-colors border ${
                      isFollowing 
                        ? "bg-surface text-text-1 border-border border-transparent" 
                        : "bg-primary text-bg border-transparent hover:bg-primary-hover"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={handleContinue}
          className="w-full h-[54px] bg-bg border border-border text-text-1 font-sans font-medium text-[15px] rounded-md hover:bg-surface transition-colors"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
