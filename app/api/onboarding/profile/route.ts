import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function POST(req: Request) {
  try {
    const { username, displayName } = await req.json();

    if (!username || !displayName) {
      return NextResponse.json({ error: "Username and Display Name are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Upsert the user into the database
    const updatedUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        username: username.toLowerCase(),
        displayName,
      },
      create: {
        id: user.id,
        email: user.email!,
        username: username.toLowerCase(),
        displayName,
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Profile onboarding error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
