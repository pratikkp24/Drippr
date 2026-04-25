import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { MOCK_CREATORS, MOCK_DROPS } from "@/lib/mock";
import { VIBES } from "@/lib/vibes";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clubdrippr.com";

export const revalidate = 3600; // refresh hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static surfaces
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/explore`, lastModified: now, changeFrequency: "hourly", priority: 0.95 },
    { url: `${SITE_URL}/explore/discover`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/signin`, lastModified: now, changeFrequency: "monthly", priority: 0.4 }
  ];

  // Vibe landing pages — high SEO value (long-tail queries like "monsoon outfits")
  const vibePages: MetadataRoute.Sitemap = VIBES.map((v) => ({
    url: `${SITE_URL}/vibe/${v.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85
  }));

  // Mock surfaces (always indexable, populated)
  const mockDropPages: MetadataRoute.Sitemap = MOCK_DROPS.map((d) => ({
    url: `${SITE_URL}/explore/drops/${d.slug}`,
    lastModified: new Date(d.publishedAt),
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const mockCreatorPages: MetadataRoute.Sitemap = MOCK_CREATORS.map((c) => ({
    url: `${SITE_URL}/explore/profile/${c.username}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7
  }));

  // Real surfaces — pull from DB if reachable, swallow errors so sitemap never 500s
  let realDrops: MetadataRoute.Sitemap = [];
  let realProfiles: MetadataRoute.Sitemap = [];
  try {
    const [drops, users] = await Promise.all([
      prisma.drop.findMany({
        where: { isPublic: true, publishedAt: { not: null } },
        select: { slug: true, updatedAt: true, publishedAt: true },
        take: 5000
      }),
      prisma.user.findMany({
        where: { drops: { some: { isPublic: true, publishedAt: { not: null } } } },
        select: { username: true, updatedAt: true },
        take: 5000
      })
    ]);

    realDrops = drops.map((d) => ({
      url: `${SITE_URL}/drops/${d.slug}`,
      lastModified: d.updatedAt ?? d.publishedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.85
    }));

    realProfiles = users.map((u) => ({
      url: `${SITE_URL}/profile/${u.username}`,
      lastModified: u.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.75
    }));
  } catch (err) {
    console.error("[sitemap] DB lookups failed (using mocks only):", err);
  }

  return [...staticPages, ...vibePages, ...mockDropPages, ...mockCreatorPages, ...realDrops, ...realProfiles];
}
