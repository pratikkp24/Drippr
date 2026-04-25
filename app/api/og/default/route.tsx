import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 };

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#F5EFE6",
          padding: 80,
          fontFamily: "Georgia, serif"
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 600, color: "#1F3D2B" }}>Drippr.</div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#6B7C72",
              marginBottom: 16
            }}
          >
            A private fashion club
          </div>
          <div style={{ fontSize: 110, lineHeight: 1.02, color: "#1F3D2B", fontWeight: 800 }}>
            Dress with <span style={{ fontStyle: "italic" }}>intent.</span>
          </div>
          <div style={{ fontSize: 28, color: "#6B7C72", marginTop: 32, maxWidth: 900 }}>
            Curated closets from creators you trust. Shop the brands you already love.
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#A8B3AA" }}>clubdrippr.com</div>
      </div>
    ),
    SIZE
  );
}
