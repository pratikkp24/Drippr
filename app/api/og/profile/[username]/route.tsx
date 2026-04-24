import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";


export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 };

export async function GET(_req: Request, { params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      displayName: true,
      username: true,
      avatarUrl: true,
      styleSignature: true,
      _count: { select: { drops: true, followers: true } }
    }
  });

  if (!user) {
    return new ImageResponse(
      (
        <div style={{ ...baseBg, color: "#1F3D2B", fontFamily: "serif", fontSize: 64 }}>Drippr.</div>
      ),
      SIZE
    );
  }

  const avatar =
    user.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&bg=E6DDCF&color=1F3D2B&size=200`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F5EFE6",
          color: "#1F3D2B",
          padding: 80,
          fontFamily: "serif"
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 600, color: "#1F3D2B" }}>Drippr.</div>
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          <img
            src={avatar}
            alt=""
            width={220}
            height={220}
            style={{ width: 220, height: 220, borderRadius: "50%", objectFit: "cover" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 72, lineHeight: 1.02, fontWeight: 800 }}>{user.displayName}</div>
            <div style={{ fontSize: 32, color: "#6B7C72" }}>@{user.username}</div>
            {user.styleSignature && (
              <div style={{ fontSize: 26, color: "#A8B3AA", fontStyle: "italic" }}>
                {user.styleSignature}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 48, fontSize: 26, color: "#6B7C72" }}>
          <span>{user._count.drops} drops</span>
          <span>{user._count.followers} followers</span>
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
