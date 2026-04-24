import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MOCK_CREATORS, MOCK_DROPS, MOCK_PIECES } from "@/lib/mock";

type HomeDrop = {
  id: string;
  slug: string;
  name: string;
  story: string | null;
  coverImage: string;
  href: string;
  source: "real" | "mock";
  piecesCount: number;
  user: {
    username: string;
    displayName: string;
    avatarUrl: string | null;
    href: string;
  };
};

type HomePiece = {
  id: string;
  name: string;
  primaryPhoto: string;
  brand: string | null;
  href: string;
  source: "real" | "mock";
  user: {
    username: string;
    displayName: string;
    avatarUrl: string | null;
    href: string;
  };
};

export async function GET() {
  try {
    const realFeatured = await prisma.drop.findFirst({
      where: { isPublic: true, publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      include: {
        user: { select: { username: true, displayName: true, avatarUrl: true } },
        _count: { select: { pieces: true } }
      }
    });

    const realPicks = await prisma.piece.findMany({
      where: { isPublic: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { username: true, displayName: true, avatarUrl: true } }
      }
    });

    const realTrending = await prisma.drop.findMany({
      where: { isPublic: true, publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      take: 6,
      skip: realFeatured ? 1 : 0,
      include: {
        user: { select: { username: true, displayName: true, avatarUrl: true } },
        _count: { select: { pieces: true } }
      }
    });

    // ─── Feature: pick real if available, else pull from mock ───────
    const featuredDrop: HomeDrop | null = realFeatured
      ? shapeRealDrop(realFeatured)
      : shapeMockDrop(pickBestMockDrop());

    // ─── Creator picks: fill with mock up to 8 ──────────────────────
    const picks: HomePiece[] = realPicks.map(shapeRealPiece);
    if (picks.length < 8) {
      const mockPicksNeeded = 8 - picks.length;
      const seenCreators = new Set(picks.map((p) => p.user.username));
      const mockPieces = mockPiecesWithCreators()
        .filter((mp) => !seenCreators.has(mp.user.username))
        .slice(0, mockPicksNeeded);
      for (const mp of mockPieces) picks.push(mp);
    }

    // ─── Trending drops: 6 cards total, mix real first then mock ────
    const trending: HomeDrop[] = realTrending.map(shapeRealDrop);
    if (trending.length < 6) {
      const needed = 6 - trending.length;
      const featuredId = featuredDrop?.id;
      const mocks = pickMockDrops(needed, featuredId);
      for (const d of mocks) trending.push(shapeMockDrop(d));
    }

    // ─── Creators to know: 8 mock creators (plus any real public users) ─
    const realCreators = await prisma.user.findMany({
      where: {
        // at least one public drop
        drops: { some: { isPublic: true, publishedAt: { not: null } } }
      },
      take: 6,
      select: {
        username: true,
        displayName: true,
        avatarUrl: true,
        styleSignature: true,
        _count: { select: { followers: true } }
      }
    });

    const creatorsToKnow = [
      ...realCreators.map((c) => ({
        username: c.username,
        displayName: c.displayName,
        avatarUrl: c.avatarUrl,
        styleSignature: c.styleSignature,
        followerCount: c._count.followers,
        href: `/profile/${c.username}`,
        source: "real" as const
      })),
      ...MOCK_CREATORS.slice(0, Math.max(0, 8 - realCreators.length)).map((c) => ({
        username: c.username,
        displayName: c.displayName,
        avatarUrl: c.avatarUrl,
        styleSignature: c.styleSignature,
        followerCount: c.followerCount,
        href: `/explore/profile/${c.username}`,
        source: "mock" as const
      }))
    ];

    return NextResponse.json({
      featuredDrop,
      creatorPicks: picks,
      trendingDrops: trending,
      creatorsToKnow,
      hasRealContent: Boolean(realFeatured || realPicks.length || realTrending.length)
    });
  } catch (error) {
    console.error("Home fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ─── Shapers ──────────────────────────────────────────────────────

function shapeRealDrop(d: {
  id: string;
  slug: string;
  name: string;
  story: string | null;
  coverImage: string;
  user: { username: string; displayName: string; avatarUrl: string | null };
  _count: { pieces: number };
}): HomeDrop {
  return {
    id: d.id,
    slug: d.slug,
    name: d.name,
    story: d.story,
    coverImage: d.coverImage,
    href: `/drops/${d.slug}`,
    source: "real",
    piecesCount: d._count.pieces,
    user: {
      username: d.user.username,
      displayName: d.user.displayName,
      avatarUrl: d.user.avatarUrl,
      href: `/profile/${d.user.username}`
    }
  };
}

function shapeRealPiece(p: {
  id: string;
  name: string;
  primaryPhoto: string | null;
  brand: string | null;
  user: { username: string; displayName: string; avatarUrl: string | null };
}): HomePiece {
  return {
    id: p.id,
    name: p.name,
    primaryPhoto: p.primaryPhoto ?? "",
    brand: p.brand,
    href: `/closet/${p.id}`,
    source: "real",
    user: {
      username: p.user.username,
      displayName: p.user.displayName,
      avatarUrl: p.user.avatarUrl,
      href: `/profile/${p.user.username}`
    }
  };
}

function pickBestMockDrop() {
  return [...MOCK_DROPS].sort((a, b) => b.saveCount - a.saveCount)[0];
}

function pickMockDrops(count: number, excludeId?: string) {
  return [...MOCK_DROPS]
    .filter((d) => d.id !== excludeId)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}

function shapeMockDrop(d: (typeof MOCK_DROPS)[number]): HomeDrop {
  const creator = MOCK_CREATORS.find((c) => c.id === d.creatorId)!;
  return {
    id: d.id,
    slug: d.slug,
    name: d.name,
    story: d.story,
    coverImage: d.coverImage,
    href: `/explore/drops/${d.slug}`,
    source: "mock",
    piecesCount: d.pieceIds.length,
    user: {
      username: creator.username,
      displayName: creator.displayName,
      avatarUrl: creator.avatarUrl,
      href: `/explore/profile/${creator.username}`
    }
  };
}

function mockPiecesWithCreators(): HomePiece[] {
  const out: HomePiece[] = [];
  for (const p of MOCK_PIECES) {
    const drop = MOCK_DROPS.find((d) => d.pieceIds.includes(p.id));
    const creator = drop ? MOCK_CREATORS.find((c) => c.id === drop.creatorId) : undefined;
    if (!creator || !drop) continue;
    out.push({
      id: p.id,
      name: p.name,
      primaryPhoto: p.primaryPhoto,
      brand: p.brand,
      href: `/explore/drops/${drop.slug}`,
      source: "mock",
      user: {
        username: creator.username,
        displayName: creator.displayName,
        avatarUrl: creator.avatarUrl,
        href: `/explore/profile/${creator.username}`
      }
    });
  }
  return out;
}
