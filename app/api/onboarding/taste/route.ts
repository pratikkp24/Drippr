import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function POST(req: Request) {
  try {
    const { vibes } = await req.json();

    if (!Array.isArray(vibes) || vibes.length < 5) {
      return NextResponse.json({ error: "Please select at least 5 vibes" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { tasteVibes: vibes }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Taste onboarding error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
