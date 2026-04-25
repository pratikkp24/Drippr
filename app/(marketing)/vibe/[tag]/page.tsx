import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getVibe, VIBES } from "@/lib/vibes";
import { MOCK_DROPS, MOCK_CREATORS } from "@/lib/mock";
import { JsonLd, breadcrumbJsonLd, vibeJsonLd } from "@/lib/seo/jsonld";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clubdrippr.com";

export async function generateStaticParams() {
  return VIBES.map((v) => ({ tag: v.slug }));
}

export const revalidate = 3600;

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await props.params;
  const vibe = getVibe(tag);
  if (!vibe) return { title: "Vibe not found" };

  const title = `${vibe.name} outfits — curated drops on Drippr`;
  const description = `${vibe.tagline} ${vibe.description.slice(0, 130)}`;
  const url = `${SITE_URL}/vibe/${vibe.slug}`;
  const image = vibe.heroImage;

  return {
    title,
    description,
    keywords: vibe.keywords,
    alternates: { canonical: `/vibe/${vibe.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: vibe.name }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export default async function VibePage(props: { params: Promise<{ tag: string }> }) {
  const { tag } = await props.params;
  const vibe = getVibe(tag);
  if (!vibe) notFound();

  const drops = MOCK_DROPS.filter((d) => d.vibeTags.includes(vibe.slug)).slice(0, 12);

  // Creators with at least one drop in this vibe
  const creatorIds = new Set(drops.map((d) => d.creatorId));
  const creators = MOCK_CREATORS.filter((c) => creatorIds.has(c.id)).slice(0, 6);

  return (
    <main className="min-h-screen bg-bg">
      <JsonLd
        data={[
          vibeJsonLd({
            slug: vibe.slug,
            name: vibe.name,
            description: vibe.description,
            drops: drops.map((d) => ({ slug: d.slug, name: d.name, coverImage: d.coverImage }))
          }),
          breadcrumbJsonLd([
            { name: "Drippr.", url: SITE_URL },
            { name: "Vibes", url: `${SITE_URL}/explore` },
            { name: vibe.name, url: `${SITE_URL}/vibe/${vibe.slug}` }
          ])
        ]}
      />

      {/* Header — minimal, links back to brand */}
      <header className="px-md sm:px-xl py-lg flex items-center justify-between max-w-[1200px] mx-auto">
        <Link href="/" className="text-[20px] sm:text-[22px] font-semibold text-primary">
          Drippr.
        </Link>
        <Link
          href="/signup"
          className="h-9 sm:h-10 px-md sm:px-lg inline-flex items-center rounded-pill bg-primary text-bg text-[13px] sm:text-[14px] font-medium hover:bg-primary-hover transition-colors"
        >
          Sign up
        </Link>
      </header>

      {/* Hero */}
      <section className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[480px] mx-md sm:mx-xl rounded-xl overflow-hidden">
        <Image
          src={vibe.heroImage}
          alt={`${vibe.name} outfits`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover"

        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
        <div className="absolute bottom-md sm:bottom-lg left-md sm:left-lg right-md sm:right-lg max-w-[760px]">
          <p className="text-[10px] sm:text-[11px] tracking-[2px] uppercase text-bg/85 mb-xs">
            Vibe
          </p>
          <h1 className="fraunces text-[clamp(36px,6.5vw,68px)] leading-[1.02] text-bg mb-sm">
            {vibe.name}.
          </h1>
          <p className="text-bg/90 text-[15px] sm:text-[18px] font-light max-w-[560px]">
            {vibe.tagline}
          </p>
        </div>
      </section>

      {/* Description — long-form for SEO */}
      <section className="max-w-[760px] mx-auto px-md sm:px-xl py-2xl">
        <p className="font-light text-[17px] sm:text-[19px] text-text-2 leading-relaxed">
          {vibe.description}
        </p>
      </section>

      {/* Drops grid */}
      <section className="max-w-[1200px] mx-auto px-md sm:px-xl pb-2xl">
        <h2 className="fraunces text-[clamp(24px,4vw,32px)] text-text-1 mb-lg">
          {vibe.name} <em className="italic">drops.</em>
        </h2>
        {drops.length === 0 ? (
          <p className="text-[15px] font-light text-text-3 italic">
            No drops yet for this vibe. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md sm:gap-lg">
            {drops.map((d) => {
              const creator = MOCK_CREATORS.find((c) => c.id === d.creatorId);
              return (
                <Link
                  key={d.id}
                  href={`/explore/drops/${d.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface border border-border mb-sm">
                    <Image
                      src={d.coverImage}
                      alt={d.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"

                    />
                  </div>
                  <h3 className="fraunces text-text-1 text-[20px] leading-tight group-hover:text-primary transition-colors">
                    {d.name}
                  </h3>
                  {creator && (
                    <p className="font-light text-[13px] text-text-3 truncate">
                      by @{creator.username} · {d.pieceIds.length} pieces
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Related creators */}
      {creators.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-md sm:px-xl pb-2xl">
          <h2 className="fraunces text-[clamp(24px,4vw,32px)] text-text-1 mb-lg">
            Creators who do {vibe.name.toLowerCase()} <em className="italic">well.</em>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
            {creators.map((c) => (
              <Link
                key={c.id}
                href={`/explore/profile/${c.username}`}
                className="flex items-center gap-md p-sm bg-surface border border-border rounded-lg hover:border-primary transition-colors"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-border">
                  <Image src={c.avatarUrl} alt={c.displayName} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[14px] text-text-1 truncate">{c.displayName}</p>
                  <p className="font-light text-[12px] text-text-3 truncate italic">{c.styleSignature}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Cross-link to other vibes — internal linking density for SEO */}
      <section className="max-w-[1200px] mx-auto px-md sm:px-xl pb-3xl border-t border-border pt-2xl">
        <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-md">More vibes</p>
        <div className="flex flex-wrap gap-1.5">
          {VIBES.filter((v) => v.slug !== vibe.slug).map((v) => (
            <Link
              key={v.slug}
              href={`/vibe/${v.slug}`}
              className="px-md h-9 inline-flex items-center rounded-full text-[13px] font-medium bg-surface border border-border text-text-2 hover:border-accent transition-colors"
            >
              {v.name}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[760px] mx-auto px-md sm:px-xl pb-3xl text-center">
        <h2 className="fraunces text-[clamp(28px,5vw,40px)] leading-[1.05] text-text-1 mb-md">
          Build your <em className="italic">{vibe.name.toLowerCase()}</em> closet on Drippr.
        </h2>
        <p className="font-light text-[15px] text-text-2 mb-lg">
          Save drops, follow creators, log what you wear. Free, invite-friendly.
        </p>
        <Link
          href="/signup"
          className="inline-flex h-[54px] px-xl items-center rounded-md bg-primary text-bg text-[15px] font-medium hover:bg-primary-hover transition-colors"
        >
          Start free
        </Link>
      </section>
    </main>
  );
}
