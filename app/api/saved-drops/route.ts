import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";


// POST /api/saved-drops  { dropId, collectionId? }
export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { dropId, collectionId } = await req.json();
    if (!dropId) return NextResponse.json({ error: "dropId required" }, { status: 400 });

    const drop = await prisma.drop.findUnique({
      where: { id: dropId },
      select: { id: true, userId: true, name: true }
    });
    if (!drop) return NextResponse.json({ error: "Drop not found" }, { status: 404 });

    const saved = await prisma.savedDrop.upsert({
      where: { userId_dropId: { userId: user.id, dropId } },
      create: { userId: user.id, dropId, collectionId: collectionId ?? null },
      update: { collectionId: collectionId ?? null }
    });

    // Notify drop creator (not self-save)
    if (drop.userId !== user.id) {
      const me = await prisma.user.findUnique({
        where: { id: user.id },
        select: { displayName: true, username: true }
      });
      if (me) {
        await prisma.notification.create({
          data: {
            userId: drop.userId,
            type: "DROP_SAVED",
            title: `${me.displayName} saved your drop`,
            body: drop.name,
            actionUrl: `/profile/${me.username}`
          }
        });
      }
    }

    return NextResponse.json({ success: true, saved });
  } catch (err) {
    console.error("save-drop error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/saved-drops?dropId=<id>
export async function DELETE(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const dropId = searchParams.get("dropId");
    if (!dropId) return NextResponse.json({ error: "dropId required" }, { status: 400 });

    await prisma.savedDrop.deleteMany({
      where: { userId: user.id, dropId }
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("unsave error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
