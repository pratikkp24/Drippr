import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";


const DUMMY_CREATORS = [
  {
    id: "dummy-1",
    displayName: "Aarav Sharma",
    username: "aarav.styles",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80&fit=crop",
    styleSignature: "Street-luxe and minimal tones"
  },
  {
    id: "dummy-2",
    displayName: "Rhea Kapoor",
    username: "rhea_k",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&fit=crop",
    styleSignature: "Elevated basics with a pop of color"
  },
  {
    id: "dummy-3",
    displayName: "Kabir Singh",
    username: "kabircore",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&fit=crop",
    styleSignature: "Japanese workwear meets vintage"
  },
  {
    id: "dummy-4",
    displayName: "Ananya Desai",
    username: "ananya.d",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&fit=crop",
    styleSignature: "Monochrome layering"
  },
  {
    id: "dummy-5",
    displayName: "Rohan Patel",
    username: "rohanp",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&fit=crop",
    styleSignature: "Gorpcore and techwear enthusiast"
  },
  {
    id: "dummy-6",
    displayName: "Tara Sutaria",
    username: "tara_s",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80&fit=crop",
    styleSignature: "Effortless casual luxury"
  },
  {
    id: "dummy-7",
    displayName: "Arjun Reddy",
    username: "arjunr",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80&fit=crop",
    styleSignature: "Sneakerhead & oversized fits"
  },
  {
    id: "dummy-8",
    displayName: "Janhvi K",
    username: "janhvik",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&fit=crop",
    styleSignature: "Experimental festive looks"
  }
];

export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Attempt to grab up to 8 other real users who have drops or established profiles
    const dbUsers = await prisma.user.findMany({
      where: {
        id: { not: user.id }
      },
      take: 8,
      orderBy: { followers: { _count: 'desc' } }, // Simple heuristic
      select: {
        id: true,
        displayName: true,
        username: true,
        avatarUrl: true,
        styleSignature: true
      }
    });

    if (dbUsers.length >= 8) {
      return NextResponse.json({ creators: dbUsers.filter(u => u.avatarUrl) });
    }

    // Merge dummy with real if needed (just return dummies for ease during setup)
    return NextResponse.json({ creators: DUMMY_CREATORS });
  } catch (error) {
    console.error("Creators fetch error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
