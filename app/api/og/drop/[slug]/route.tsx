import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";


export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 };

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const drop = await prisma.drop.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      coverImage: true,
      user: { select: { username: true, displayName: true } },
      _count: { select: { pieces: true } }
    }
  });

  if (!drop) {
    return new ImageResponse(
      (
        <div style={baseBg}>
          <span style={{ fontSize: 64, color: "#1F3D2B", fontFamily: "serif" }}>Drippr.</span>
        </div>
      ),
      SIZE
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F5EFE6",
          color: "#1F3D2B",
          position: "relative",
          fontFamily: "serif"
        }}
      >
        <img
          src={drop.coverImage}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(31,61,43,0.92) 0%, rgba(31,61,43,0.35) 60%, rgba(0,0,0,0) 100%)"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: 64,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#F5EFE6"
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 600 }}>Drippr.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                fontSize: 18,
                letterSpacing: 3,
                textTransform: "uppercase",
                opacity: 0.85
              }}
            >
              Curated drop
            </div>
            <div style={{ fontSize: 88, lineHeight: 1.02, fontWeight: 800 }}>{drop.name}</div>
            <div style={{ fontSize: 28, opacity: 0.9 }}>
              by @{drop.user.username} · {drop._count.pieces} pieces
            </div>
          </div>
        </div>
      </div>
    ),
    SIZE
  );
}

const baseBg = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#F5EFE6"
} as const;
