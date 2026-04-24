import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ users: [], drops: [], pieces: [] });
    }

    const [users, drops, pieces] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: q, mode: 'insensitive' } },
            { displayName: { contains: q, mode: 'insensitive' } }
          ]
        },
        take: 5,
        select: { id: true, username: true, displayName: true, avatarUrl: true }
      }),
      prisma.drop.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' },
          isPublic: true
        },
        take: 5,
        include: { user: { select: { username: true } } }
      }),
      prisma.piece.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' },
          isPublic: true
        },
        take: 10,
        include: { user: { select: { username: true } } }
      })
    ]);

    return NextResponse.json({ users, drops, pieces });
  } catch (error) {
    console.error("Search fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
