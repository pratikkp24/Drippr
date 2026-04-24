import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, brand, image, price, sourceUrl, category } = data;

    if (!name || !image || !category) {
      return NextResponse.json({ error: "Name, Image and Category are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try to find or create the partner based on the brand/domain
    let partnerId = null;
    if (sourceUrl) {
      const domain = new URL(sourceUrl).hostname.replace("www.", "");
      const partner = await prisma.partner.findFirst({
        where: { domain: { contains: domain } }
      });
      if (partner) partnerId = partner.id;
    }

    const piece = await prisma.piece.create({
      data: {
        userId: user.id,
        name,
        brand,
        category,
        primaryPhoto: image,
        photos: [image],
        sourceType: sourceUrl ? "AFFILIATE_LINK" : "MANUAL_UPLOAD",
        sourceUrl,
        purchasePrice: price ? price : null,
        partnerId,
        isPublic: true
      }
    });

    return NextResponse.json({ success: true, piece });
  } catch (error) {
    console.error("Add piece error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
