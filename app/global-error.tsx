"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5EFE6",
          color: "#1F3D2B",
          fontFamily: "system-ui, sans-serif",
          padding: "24px",
          margin: 0
        }}
      >
        <div style={{ maxWidth: 440, textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#A8B3AA",
              margin: "0 0 8px"
            }}
          >
            Something slipped
          </p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 40, lineHeight: 1.05, margin: "0 0 16px" }}>
            We hit a <em>snag.</em>
          </h1>
          <p style={{ fontSize: 15, color: "#6B7C72", marginBottom: 32 }}>
            Try again. If it keeps happening, sign back in.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              style={{
                height: 48,
                padding: "0 24px",
                borderRadius: 14,
                background: "#1F3D2B",
                color: "#F5EFE6",
                border: "none",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              Try again
            </button>
            <a
              href="/signin"
              style={{
                height: 48,
                padding: "0 24px",
                borderRadius: 14,
                border: "1px solid #E6DDCF",
                color: "#1F3D2B",
                fontSize: 14,
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none"
              }}
            >
              Sign in
            </a>
          </div>
          {error.digest && (
            <p style={{ marginTop: 32, fontSize: 11, color: "#A8B3AA", fontFamily: "monospace" }}>
              ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
