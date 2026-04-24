import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";


// DELETE /api/user/pieces/[pieceId] — soft archive
export async function DELETE(_req: Request, props: { params: Promise<{ pieceId: string }> }) {
  const params = await props.params;
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const piece = await prisma.piece.findUnique({ where: { id: params.pieceId } });
    if (!piece || piece.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.piece.update({
      where: { id: params.pieceId },
      data: { isArchived: true }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Archive piece error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
