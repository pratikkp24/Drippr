import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// Trimmed font payload (was 6 files, now 4) — Fraunces only ships 800 italic
// because that's the only style we use. DM Sans drops 600 (unused).
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["800"],
  style: ["italic", "normal"],
  variable: "--font-fraunces",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"]
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"]
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clubdrippr.com";

export const viewport: Viewport = {
  themeColor: "#1F3D2B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Drippr. — A private fashion club",
    template: "%s · Drippr."
  },
  description:
    "Curated closets from creators you trust. Shop the brands you already love — Myntra, Ajio, Zara, Uniqlo and more. No hauls. No noise. Just real outfits.",
  applicationName: "Drippr.",
  keywords: [
    "drippr",
    "fashion",
    "closet planner",
    "outfit planner",
    "creator fashion",
    "fashion drops",
    "Indian fashion",
    "Myntra outfits",
    "Ajio style",
    "Zara India",
    "minimalist fashion",
    "quiet luxury",
    "monsoon outfits",
    "workwear India",
    "personal stylist app"
  ],
  authors: [{ name: "Drippr" }],
  creator: "Drippr",
  publisher: "Drippr",
  category: "fashion",
  alternates: { canonical: "/" },
  formatDetection: { email: false, address: false, telephone: false },

  icons: {
    icon: [
      { url: "/icon", type: "image/png", sizes: "any" }
    ],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
    shortcut: ["/icon"]
  },
  manifest: "/site.webmanifest",

  openGraph: {
    type: "website",
    siteName: "Drippr.",
    title: "Drippr. — A private fashion club",
    description:
      "Curated closets from creators you trust. Shop the brands you already love. No hauls. Just real outfits.",
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: "/api/og/default",
        width: 1200,
        height: 630,
        alt: "Drippr. — A private fashion club"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "Drippr. — A private fashion club",
    description:
      "Curated closets from creators you trust. Shop the brands you already love. No hauls. Just real outfits.",
    images: ["/api/og/default"],
    creator: "@drippr"
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },

  verification: {
    // Fill these in after you set up Search Console / Bing Webmaster:
    // google: "your-google-site-verification",
    // other: { "msvalidate.01": "your-bing-verification" }
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
        <GoogleAnalytics gaId="G-44L9RMZEWD" />
      </body>
    </html>
  );
}
