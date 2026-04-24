import { NextResponse } from "next/server";
import { getHomeFeed } from "@/lib/mock";

export const dynamic = "force-dynamic";

export async function GET() {
  const { featuredDrop, creatorPicks } = getHomeFeed();

  // Add the "user" field to featuredDrop for compatibility
  const response = NextResponse.json({
    featuredDrop: {
      ...featuredDrop,
      user: featuredDrop.creator
    },
    creatorPicks
  });

  response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

  return response;
}
