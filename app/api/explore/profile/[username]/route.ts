import { NextResponse } from "next/server";
import { getCreatorProfile } from "@/lib/mock";

export const dynamic = "force-dynamic";

export async function GET(req: Request, props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const data = getCreatorProfile(params.username);

  if (!data) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const response = NextResponse.json(data);

  response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

  return response;
}
