import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Get the latest public drop
    const featuredDrop = await prisma.drop.findFirst({
      where: { isPublic: true },
      orderBy: { publishedAt: 'desc' },
      include: {
        user: {
          select: { username: true, displayName: true, avatarUrl: true }
        }
      }
    });

    // 2. Get latest public pieces (Creator Picks)
    const creatorPicks = await prisma.piece.findMany({
      where: { isPublic: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { username: true, displayName: true, avatarUrl: true }
        }
      }
    });

    return NextResponse.json({
      featuredDrop,
      creatorPicks
    });
  } catch (error) {
    console.error("Home fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
