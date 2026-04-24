import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function POST(req: Request) {
  try {
    const { title, story, pieceIds, coverImage } = await req.json();

    if (!title || !pieceIds || pieceIds.length === 0) {
      return NextResponse.json({ error: "Title and at least one piece are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Slugify title
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 5);

    const drop = await prisma.drop.create({
      data: {
        userId: user.id,
        name: title,
        slug,
        story,
        coverImage: coverImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        isPublic: true,
        publishedAt: new Date(),
        pieces: {
          create: pieceIds.map((id: string, index: number) => ({
            pieceId: id,
            order: index
          }))
        }
      }
    });

    // Notify followers of the creator
    const [followers, me] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: user.id },
        select: { followerId: true }
      }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: { displayName: true, username: true }
      })
    ]);
    if (followers.length > 0 && me) {
      await prisma.notification.createMany({
        data: followers.map((f) => ({
          userId: f.followerId,
          type: "DROP_PUBLISHED_BY_FOLLOWED" as const,
          title: `${me.displayName} published a new drop`,
          body: title,
          actionUrl: `/drops/${slug}`
        }))
      });
    }

    return NextResponse.json({ success: true, drop });
  } catch (error) {
    console.error("Create drop error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
