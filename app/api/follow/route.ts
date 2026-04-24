import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function POST(req: Request) {
  try {
    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.id === targetUserId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    // Skip if dummy user
    if (targetUserId.startsWith("dummy-")) {
      return NextResponse.json({ success: true, dummy: true });
    }

    // Check if follow already exists to prevent duplicate insertion error
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ success: true, message: "Already following" });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: targetUserId
      }
    });

    // Create Notification type NEW_FOLLOWER for target user
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: "NEW_FOLLOWER",
        title: "New Follower",
        body: "Someone started following you." // Would replace with actual display name
      }
    });

    return NextResponse.json({ success: true, follow });
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
