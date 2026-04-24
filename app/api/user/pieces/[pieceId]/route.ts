import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

// DELETE /api/user/pieces/[pieceId] — soft archive
export async function DELETE(
  _req: Request,
  { params }: { params: { pieceId: string } }
) {
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
