import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: { userId: string; isArchived: false; category?: any } = {
      userId: user.id,
      isArchived: false
    };
    if (category && category !== "ALL") {
      where.category = category;
    }

    const pieces = await prisma.piece.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        brand: true,
        category: true,
        primaryPhoto: true,
        createdAt: true,
        partner: { select: { name: true, slug: true } },
        _count: { select: { wearLogs: true } },
        wearLogs: {
          orderBy: { wornAt: "desc" },
          take: 1,
          select: { wornAt: true }
        }
      }
    });

    const shaped = pieces.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      primaryPhoto: p.primaryPhoto,
      partner: p.partner,
      wearCount: p._count.wearLogs,
      lastWornAt: p.wearLogs[0]?.wornAt ?? null,
      createdAt: p.createdAt
    }));

    return NextResponse.json(shaped);
  } catch (error) {
    console.error("Get pieces error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
