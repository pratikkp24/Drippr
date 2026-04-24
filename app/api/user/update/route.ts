import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function PATCH(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { displayName, username, bio, styleSignature, location, avatarUrl } = await req.json();

    // Basic validation
    if (!displayName || !username) {
      return NextResponse.json({ error: "Display Name and Username are required" }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json({ error: "Invalid username format" }, { status: 400 });
    }

    // Update user in DB
    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        displayName,
        username: username.toLowerCase(),
        bio,
        styleSignature,
        location,
        avatarUrl
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Update profile error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
