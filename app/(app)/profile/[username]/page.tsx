import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { Settings, Share, Grid, Layers } from "lucide-react";
import FollowButton from "./follow-button";

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;

  const dbUser = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: { followers: true, following: true, pieces: true, drops: true }
      }
    }
  });

  if (!dbUser) {
    notFound();
  }

  const authUser = await getUser();
  const isOwnProfile = authUser?.id === dbUser.id;

  let isFollowing = false;
  if (authUser && !isOwnProfile) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: authUser.id,
          followingId: dbUser.id
        }
      }
    });
    isFollowing = !!follow;
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-[1000px] mx-auto px-xl py-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-xl">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border border-border shadow-sm bg-surface">
                <Image
                  src={dbUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(dbUser.displayName)}&bg=E6DDCF&color=1F3D2B&size=200`}
                  alt={dbUser.displayName}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              
              <div className="space-y-sm">
                <div>
                  <h1 className="fraunces text-[32px] text-text-1 leading-tight mb-1">
                    {dbUser.displayName}
                  </h1>
                  <p className="font-sans font-light text-[15px] text-text-3">
                    @{dbUser.username}
                  </p>
                </div>

                <div className="flex items-center space-x-lg">
                  <div className="flex items-baseline space-x-1">
                    <span className="font-sans font-medium text-[16px] text-text-1">{dbUser._count.drops}</span>
                    <span className="font-sans font-light text-[13px] text-text-3">drops</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="font-sans font-medium text-[16px] text-text-1">{dbUser._count.followers}</span>
                    <span className="font-sans font-light text-[13px] text-text-3">followers</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="font-sans font-medium text-[16px] text-text-1">89</span>
                    <span className="font-sans font-light text-[13px] text-text-3">saves</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-sm">
              {isOwnProfile ? (
                <Link
                  href="/drops/me"
                  className="h-[40px] px-lg rounded-full bg-primary text-bg font-sans font-medium text-[13px] hover:bg-primary-hover transition-colors flex items-center"
                >
                  My drops
                </Link>
              ) : (
                <FollowButton targetUserId={dbUser.id} initialFollowing={isFollowing} />
              )}
            </div>
          </div>

          <nav className="flex items-center space-x-xl mt-2xl">
            <button className="py-sm px-2 text-[15px] font-sans font-medium text-text-1 border-b-2 border-primary">
              Drops
            </button>
            <button className="py-sm px-2 text-[15px] font-sans font-medium text-text-3 hover:text-text-1 border-b-2 border-transparent transition-colors">
              Closet
            </button>
            <button className="py-sm px-2 text-[15px] font-sans font-medium text-text-3 hover:text-text-1 border-b-2 border-transparent transition-colors">
              Saved
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto p-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
          {/* Mock Drops */}
          {[
            { id: "1", title: "Weekend Linen Edit", pieces: 6, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" },
            { id: "2", title: "Office Quiet Luxe", pieces: 8, image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80" }
          ].map((drop) => (
            <div key={drop.id} className="group cursor-pointer">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-lg shadow-sm border border-border bg-surface">
                <Image
                  src={drop.image}
                  alt={drop.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="fraunces text-text-1 text-[20px]">{drop.title}</h3>
                <p className="font-sans font-light text-text-3 text-[14px]">{drop.pieces} pieces</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
