import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const pieces = await prisma.piece.findMany({
      where: {
        isPublic: true,
        ...(category && category !== "All" ? { category: category as any } : {})
      },
      take: 24,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { username: true, displayName: true, avatarUrl: true }
        },
        partner: true
      }
    });

    return NextResponse.json(pieces);
  } catch (error) {
    console.error("Discover fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
