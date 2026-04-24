import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import FollowButton from "./follow-button";
import ProfileTabs from "./profile-tabs";

export default async function ProfilePage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const { username } = params;

  const dbUser = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: { followers: true, following: true, drops: true, savedDrops: true, pieces: true }
      }
    }
  });

  if (!dbUser) notFound();

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

  // Drops — published only for non-owners; all for self
  const drops = await prisma.drop.findMany({
    where: {
      userId: dbUser.id,
      ...(isOwnProfile ? {} : { publishedAt: { not: null }, isPublic: true })
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      coverImage: true,
      _count: { select: { pieces: true } }
    }
  });

  // Closet — own profile sees everything; others see public + non-archived
  const closetPieces = await prisma.piece.findMany({
    where: {
      userId: dbUser.id,
      isArchived: false,
      ...(isOwnProfile ? {} : { isPublic: true })
    },
    orderBy: { createdAt: "desc" },
    take: 60,
    select: {
      id: true,
      name: true,
      primaryPhoto: true,
      category: true,
      brand: true
    }
  });

  // Saved drops — only visible on own profile (privacy)
  const savedDrops = isOwnProfile
    ? await prisma.savedDrop.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
        include: {
          drop: {
            select: {
              id: true,
              slug: true,
              name: true,
              coverImage: true,
              user: { select: { username: true, displayName: true } },
              _count: { select: { pieces: true } }
            }
          }
        }
      })
    : [];

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-[1000px] mx-auto px-xl py-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-xl">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border border-border shadow-sm bg-surface">
                <Image
                  src={
                    dbUser.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(dbUser.displayName)}&bg=E6DDCF&color=1F3D2B&size=200`
                  }
                  alt={dbUser.displayName}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="space-y-sm">
                <div>
                  <h1 className="fraunces text-[32px] text-text-1 leading-tight mb-1">{dbUser.displayName}</h1>
                  <p className="font-sans font-light text-[15px] text-text-3">@{dbUser.username}</p>
                  {dbUser.styleSignature && (
                    <p className="font-sans font-light italic text-[13px] text-text-3 mt-1">
                      {dbUser.styleSignature}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-lg">
                  <Stat value={dbUser._count.drops} label="drops" />
                  <Stat value={dbUser._count.followers} label="followers" />
                  {isOwnProfile && <Stat value={dbUser._count.savedDrops} label="saves" />}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-sm">
              {isOwnProfile ? (
                <Link
                  href="/profile/settings"
                  className="h-[40px] px-lg rounded-full border border-border text-text-1 font-sans font-medium text-[13px] hover:border-primary transition-colors flex items-center"
                >
                  Edit profile
                </Link>
              ) : (
                <FollowButton targetUserId={dbUser.id} initialFollowing={isFollowing} />
              )}
            </div>
          </div>
        </div>
      </header>

      <ProfileTabs
        isOwnProfile={isOwnProfile}
        drops={drops}
        closet={closetPieces}
        saved={savedDrops.map((s) => s.drop)}
        counts={{
          drops: drops.length,
          closet: closetPieces.length,
          saved: savedDrops.length
        }}
      />
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline space-x-1">
      <span className="font-sans font-medium text-[16px] text-text-1">{value}</span>
      <span className="font-sans font-light text-[13px] text-text-3">{label}</span>
    </div>
  );
}
