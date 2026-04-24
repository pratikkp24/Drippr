import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";


// GET /api/drops/[slug]/comments
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const drop = await prisma.drop.findUnique({
      where: { slug: params.slug },
      select: { id: true }
    });
    if (!drop) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const comments = await prisma.comment.findMany({
      where: { dropId: drop.id, parentId: null },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { select: { username: true, displayName: true, avatarUrl: true } },
        replies: {
          orderBy: { createdAt: "asc" },
          take: 10,
          include: {
            user: { select: { username: true, displayName: true, avatarUrl: true } }
          }
        }
      }
    });

    return NextResponse.json({ comments });
  } catch (err) {
    console.error("comments GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/drops/[slug]/comments  body: { body, parentId? }
export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { body, parentId } = await req.json();
    const text = (body ?? "").trim();
    if (!text) return NextResponse.json({ error: "body required" }, { status: 400 });
    if (text.length > 500) return NextResponse.json({ error: "max 500 characters" }, { status: 400 });

    const drop = await prisma.drop.findUnique({
      where: { slug: params.slug },
      select: { id: true, userId: true, name: true }
    });
    if (!drop) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const comment = await prisma.comment.create({
      data: {
        dropId: drop.id,
        userId: user.id,
        body: text,
        parentId: parentId || null
      },
      include: {
        user: { select: { username: true, displayName: true, avatarUrl: true } }
      }
    });

    // Notify drop creator on top-level comments (not self)
    if (!parentId && drop.userId !== user.id) {
      const me = await prisma.user.findUnique({
        where: { id: user.id },
        select: { displayName: true, username: true }
      });
      if (me) {
        await prisma.notification.create({
          data: {
            userId: drop.userId,
            type: "SYSTEM",
            title: `${me.displayName} commented on your drop`,
            body: text.slice(0, 140),
            actionUrl: `/drops/${params.slug}`
          }
        });
      }
    }

    return NextResponse.json({ comment });
  } catch (err) {
    console.error("comments POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
