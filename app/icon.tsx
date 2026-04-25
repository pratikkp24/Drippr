import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 24,
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
