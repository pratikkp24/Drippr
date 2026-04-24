import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

// GET /api/closet/insights?from=YYYY-MM-DD&to=YYYY-MM-DD
// Defaults to current month.
export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const now = new Date();
    const from = searchParams.get("from")
      ? new Date(searchParams.get("from")!)
      : new Date(now.getFullYear(), now.getMonth(), 1);
    const to = searchParams.get("to")
      ? new Date(searchParams.get("to")!)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const sixtyDaysAgo = new Date(Date.now() - 60 * 86_400_000);

    const [logs, totalPieces, dormantPieces, occasionRows, topPieceRows] = await Promise.all([
      // All wear logs in range
      prisma.wearLog.findMany({
        where: { userId: user.id, wornAt: { gte: from, lte: to } },
        select: { id: true, wornAt: true, pieceId: true, occasion: true }
      }),
      // Total active closet size
      prisma.piece.count({
        where: { userId: user.id, isArchived: false }
      }),
      // Pieces never worn in last 60 days (dormant)
      prisma.piece.findMany({
        where: {
          userId: user.id,
          isArchived: false,
          NOT: { wearLogs: { some: { wornAt: { gte: sixtyDaysAgo } } } }
        },
        select: { id: true, name: true, primaryPhoto: true, category: true },
        take: 8
      }),
      // Occasion breakdown
      prisma.wearLog.groupBy({
        by: ["occasion"],
        where: { userId: user.id, wornAt: { gte: from, lte: to }, occasion: { not: null } },
        _count: { _all: true }
      }),
      // Top-worn pieces in range
      prisma.wearLog.groupBy({
        by: ["pieceId"],
        where: { userId: user.id, wornAt: { gte: from, lte: to }, pieceId: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { pieceId: "desc" } },
        take: 5
      })
    ]);

    const topPieceIds = topPieceRows.map((r) => r.pieceId).filter((id): id is string => !!id);
    const topPieces = topPieceIds.length
      ? await prisma.piece.findMany({
          where: { id: { in: topPieceIds }, userId: user.id },
          select: { id: true, name: true, primaryPhoto: true, brand: true, category: true }
        })
      : [];
    const topWithCounts = topPieces
      .map((p) => ({
        ...p,
        wears: topPieceRows.find((r) => r.pieceId === p.id)?._count._all ?? 0
      }))
      .sort((a, b) => b.wears - a.wears);

    // Unique days logged
    const uniqueDays = new Set(
      logs.map((l) => {
        const d = new Date(l.wornAt);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
    );

    // Streak: count consecutive days backwards from today with at least one log
    const allLogDays = await prisma.wearLog.findMany({
      where: { userId: user.id },
      select: { wornAt: true },
      orderBy: { wornAt: "desc" },
      take: 365
    });
    const logDaySet = new Set(
      allLogDays.map((l) => {
        const d = new Date(l.wornAt);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
    );
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
      if (logDaySet.has(key)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else if (i === 0) {
        // Today not logged yet — don't break streak, start from yesterday
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    const daysInRange = Math.max(
      1,
      Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1
    );

    return NextResponse.json({
      range: { from: from.toISOString(), to: to.toISOString() },
      totals: {
        totalWears: logs.length,
        daysLogged: uniqueDays.size,
        daysInRange,
        totalPieces,
        streak
      },
      occasionBreakdown: occasionRows
        .filter((r) => r.occasion)
        .map((r) => ({ occasion: r.occasion, count: r._count._all })),
      topPieces: topWithCounts,
      dormantPieces
    });
  } catch (err) {
    console.error("insights error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
