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

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Skip if dummy user
    if (targetUserId.startsWith("dummy-")) {
      return NextResponse.json({ success: true, dummy: true });
    }

    await prisma.follow.deleteMany({
      where: {
        followerId: user.id,
        followingId: targetUserId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unfollow error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
