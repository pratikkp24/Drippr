import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { wrapAffiliateUrl } from "@/lib/affiliate/deeplink";

export const dynamic = "force-dynamic";


// POST /api/affiliate/track
// body: { pieceId?, dropId?, partnerId?, originalUrl, source?: "drop"|"discover"|"closet"|"home" }
// returns: { redirectUrl, clickId }
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    const { pieceId, dropId, originalUrl } = body;
    let { partnerId } = body;

    if (!originalUrl) {
      return NextResponse.json({ error: "originalUrl required" }, { status: 400 });
    }

    // Derive partner by domain if not explicitly passed
    let partnerSlug: string | null = null;
    try {
      const host = new URL(originalUrl).hostname.replace(/^www\./, "");
      const partner = await prisma.partner.findFirst({
        where: { domain: { contains: host.split(".")[0] } },
        select: { id: true, slug: true }
      });
      if (partner) {
        partnerId = partnerId || partner.id;
        partnerSlug = partner.slug;
      }
    } catch {
      /* bad URL */
    }

    const sessionId = req.headers.get("x-session-id") || crypto.randomUUID();

    const click = await prisma.outboundClick.create({
      data: {
        userId: user?.id,
        pieceId: pieceId || null,
        dropId: dropId || null,
        partnerId: partnerId || "unknown",
        clickedUrl: originalUrl,
        sessionId,
        userAgent: req.headers.get("user-agent") || null,
        referrer: req.headers.get("referer") || null
      }
    });

    const redirectUrl = wrapAffiliateUrl(originalUrl, partnerSlug, click.id);
    return NextResponse.json({ redirectUrl, clickId: click.id });
  } catch (err) {
    console.error("affiliate/track error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
