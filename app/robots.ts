import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clubdrippr.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/explore", "/vibe", "/drops", "/profile"],
        disallow: [
          "/api/",
          "/auth/",
          "/onboarding/",
          "/closet/",
          "/profile/settings",
          "/profile/me",
          "/drops/create",
          "/drops/me"
        ]
      },
      // Explicitly allow major LLM crawlers (GEO)
      { userAgent: "GPTBot", allow: ["/", "/explore", "/vibe"] },
      { userAgent: "ClaudeBot", allow: ["/", "/explore", "/vibe"] },
      { userAgent: "anthropic-ai", allow: ["/", "/explore", "/vibe"] },
      { userAgent: "PerplexityBot", allow: ["/", "/explore", "/vibe"] },
      { userAgent: "Google-Extended", allow: ["/", "/explore", "/vibe"] },
      { userAgent: "CCBot", allow: ["/", "/explore", "/vibe"] }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
