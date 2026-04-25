import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const GA_ID = "G-44L9RMZEWD";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "800"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap"
});

// SECURITY UPDATE: REBUILD TRIGGER 2026-04-25-v3
export const metadata: Metadata = {
  title: "Drippr.",
  description: "A private fashion club on mobile and web.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
      </body>
    </html>
  );
}
