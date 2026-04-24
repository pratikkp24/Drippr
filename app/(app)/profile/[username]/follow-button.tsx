"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FollowButton({ targetUserId, initialFollowing }: { targetUserId: string, initialFollowing: boolean }) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function toggleFollow() {
    setLoading(true);
    // Optimistic toggle could be placed here instead
    
    try {
      if (isFollowing) {
        // Unfollow
        const res = await fetch("/api/unfollow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetUserId })
        });
        if (res.ok) setIsFollowing(false);
      } else {
        // Follow
        const res = await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetUserId })
        });
        if (res.ok) setIsFollowing(true);
      }
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`flex-1 h-[40px] rounded-full font-sans font-medium text-[13px] transition-colors border ${
        isFollowing 
          ? "bg-surface text-text-1 border-border hover:bg-border/50" 
          : "bg-primary text-bg border-transparent hover:bg-primary-hover"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
