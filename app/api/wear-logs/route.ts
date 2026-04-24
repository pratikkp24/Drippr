import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import type { Occasion, Feeling } from "@prisma/client";

export const dynamic = "force-dynamic";


// GET /api/wear-logs?from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: {
      userId: string;
      wornAt?: { gte?: Date; lte?: Date };
    } = { userId: user.id };

    if (from || to) {
      where.wornAt = {};
      if (from) where.wornAt.gte = new Date(from);
      if (to) where.wornAt.lte = new Date(to);
    }

    const logs = await prisma.wearLog.findMany({
      where,
      orderBy: { wornAt: "desc" },
      include: {
        piece: {
          select: { id: true, name: true, primaryPhoto: true, category: true }
        }
      }
    });

    return NextResponse.json(logs);
  } catch (err) {
    console.error("wear-logs GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/wear-logs
// body: { pieceIds: string[], wornAt?: string (ISO, defaults to now), occasion?, feeling?, notes? }
// creates an Outfit (no name) + OutfitPiece rows + one WearLog per piece
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const pieceIds: string[] = Array.isArray(body.pieceIds) ? body.pieceIds : [];
    if (pieceIds.length === 0) {
      return NextResponse.json({ error: "pieceIds required" }, { status: 400 });
    }
    const wornAt = body.wornAt ? new Date(body.wornAt) : new Date();
    const occasion: Occasion | undefined = body.occasion || undefined;
    const feeling: Feeling | undefined = body.feeling || undefined;
    const notes: string | undefined = body.notes || undefined;

    // Ownership check
    const ownedCount = await prisma.piece.count({
      where: { id: { in: pieceIds }, userId: user.id }
    });
    if (ownedCount !== pieceIds.length) {
      return NextResponse.json({ error: "One or more pieces not found" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const outfit = await tx.outfit.create({
        data: {
          userId: user.id,
          occasion,
          pieces: {
            create: pieceIds.map((pieceId) => ({ pieceId }))
          }
        }
      });

      await tx.wearLog.createMany({
        data: pieceIds.map((pieceId) => ({
          userId: user.id,
          pieceId,
          outfitId: outfit.id,
          wornAt,
          occasion,
          feeling,
          notes
        }))
      });

      return outfit;
    });

    return NextResponse.json({ success: true, outfitId: result.id });
  } catch (err) {
    console.error("wear-logs POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
