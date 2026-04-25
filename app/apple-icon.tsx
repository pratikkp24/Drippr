import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1F3D2B",
          color: "#F5EFE6",
          fontFamily: "Georgia, serif",
          fontSize: 120,
          fontWeight: 800,
          fontStyle: "italic",
          letterSpacing: "-0.04em"
        }}
      >
        D
      </div>
    ),
    size
  );
}
