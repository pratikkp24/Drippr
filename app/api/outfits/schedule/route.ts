import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import type { Occasion, TimeOfDay } from "@prisma/client";

export const dynamic = "force-dynamic";


// GET /api/outfits/schedule?from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const outfits = await prisma.outfit.findMany({
      where: {
        userId: user.id,
        scheduledFor: {
          not: null,
          ...(from ? { gte: new Date(from) } : {}),
          ...(to ? { lte: new Date(to) } : {})
        }
      },
      orderBy: { scheduledFor: "asc" },
      include: {
        pieces: {
          include: {
            piece: { select: { id: true, name: true, primaryPhoto: true, category: true } }
          }
        }
      }
    });

    return NextResponse.json(outfits);
  } catch (err) {
    console.error("schedule GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/outfits/schedule
// body: { pieceIds: string[], scheduledFor: string (ISO), name?, occasion?, timeOfDay? }
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
    if (!body.scheduledFor) {
      return NextResponse.json({ error: "scheduledFor required" }, { status: 400 });
    }
    const scheduledFor = new Date(body.scheduledFor);
    if (Number.isNaN(scheduledFor.getTime())) {
      return NextResponse.json({ error: "Invalid scheduledFor" }, { status: 400 });
    }

    const name: string | undefined = body.name || undefined;
    const occasion: Occasion | undefined = body.occasion || undefined;
    const timeOfDay: TimeOfDay | undefined = body.timeOfDay || undefined;

    const ownedCount = await prisma.piece.count({
      where: { id: { in: pieceIds }, userId: user.id }
    });
    if (ownedCount !== pieceIds.length) {
      return NextResponse.json({ error: "One or more pieces not found" }, { status: 400 });
    }

    const outfit = await prisma.outfit.create({
      data: {
        userId: user.id,
        name,
        scheduledFor,
        occasion,
        timeOfDay,
        pieces: {
          create: pieceIds.map((pieceId) => ({ pieceId }))
        }
      },
      include: { pieces: true }
    });

    return NextResponse.json({ success: true, outfit });
  } catch (err) {
    console.error("schedule POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/outfits/schedule?id=<outfitId>
export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const outfit = await prisma.outfit.findUnique({ where: { id } });
    if (!outfit || outfit.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.outfit.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("schedule DELETE error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
