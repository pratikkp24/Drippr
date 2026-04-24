import { NextResponse } from "next/server";
import { getDiscoverPieces } from "@/lib/mock";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const vibe = searchParams.get("vibe") || undefined;

  const pieces = getDiscoverPieces({
     category,
     vibeTag: vibe 
  }).map(p => ({
    ...p,
    user: p.creator // match field name for swappability
  }));

  const response = NextResponse.json({ pieces });

  response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

  return response;
}
