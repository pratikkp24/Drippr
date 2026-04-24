import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const drops = await prisma.drop.findMany({
      where: { isPublic: true },
      take: 20,
      orderBy: { publishedAt: 'desc' },
      include: {
        user: {
          select: { username: true, displayName: true, avatarUrl: true }
        },
        _count: {
          select: { pieces: true }
        }
      }
    });

    return NextResponse.json(drops);
  } catch (error) {
    console.error("Drops fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
