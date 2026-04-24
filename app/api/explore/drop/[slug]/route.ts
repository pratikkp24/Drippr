import { NextResponse } from "next/server";
import { getDropBySlug } from "@/lib/mock";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const data = getDropBySlug(params.slug);

  if (!data) {
    return NextResponse.json({ error: "Drop not found" }, { status: 404 });
  }

  // Ensure pieces also have the user attached if components expect it
  const pieces = data.pieces.map(p => ({
    ...p,
    user: data.creator
  }));

  const response = NextResponse.json({
    drop: data,
    creator: data.creator,
    pieces
  });

  response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

  return response;
}
