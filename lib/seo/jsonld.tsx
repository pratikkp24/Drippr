// JSON-LD structured data helpers. Used by every public page so Google,
// Bing, ChatGPT, Claude, Perplexity etc. can extract rich entities.

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clubdrippr.com";

type AnyJsonLd = Record<string, unknown>;

// ─── Organization (renders once, on landing) ─────────────────
export function organizationJsonLd(): AnyJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#org`,
    name: "Drippr.",
    alternateName: "Drippr",
    url: SITE_URL,
    logo: `${SITE_URL}/api/og/default`,
    description:
      "A private fashion club. Curated closets from creators you trust. India-first, brand-agnostic.",
    foundingDate: "2026",
    areaServed: "IN",
    sameAs: [
      // Add your real handles when you have them:
      // "https://www.instagram.com/drippr",
      // "https://x.com/drippr"
    ]
  };
}

export function websiteJsonLd(): AnyJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: "Drippr.",
    description:
      "Curated closets from creators you trust. Shop the brands you already love.",
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE_URL}#org` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string"
    }
  };
}

// ─── Person / Creator ────────────────────────────────────────
export function personJsonLd(args: {
  username: string;
  displayName: string;
  bio?: string | null;
  styleSignature?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  followerCount?: number;
  url?: string;
}): AnyJsonLd {
  const url = args.url || `${SITE_URL}/profile/${args.username}`;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name: args.displayName,
    alternateName: `@${args.username}`,
    description: args.bio || args.styleSignature || `${args.displayName} on Drippr.`,
    image: args.avatarUrl || `${SITE_URL}/api/og/profile/${args.username}`,
    url,
    homeLocation: args.location ? { "@type": "Place", name: args.location } : undefined,
    knowsAbout: args.styleSignature ? [args.styleSignature] : undefined,
    interactionStatistic: args.followerCount !== undefined
      ? {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/FollowAction",
          userInteractionCount: args.followerCount
        }
      : undefined
  };
}

// ─── Drop = Article + ItemList of pieces ─────────────────────
export function dropJsonLd(args: {
  slug: string;
  name: string;
  story?: string | null;
  coverImage: string;
  publishedAt?: string | Date | null;
  updatedAt?: string | Date | null;
  creator: { username: string; displayName: string; avatarUrl?: string | null };
  pieces: Array<{
    id: string;
    name: string;
    primaryPhoto?: string | null;
    brand?: string | null;
    sourceUrl?: string | null;
    price?: number | null;
    partner?: { name: string } | null;
  }>;
  url?: string;
}): AnyJsonLd[] {
  const url = args.url || `${SITE_URL}/drops/${args.slug}`;
  const article: AnyJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: args.name,
    description: args.story || `A curated drop by @${args.creator.username} on Drippr.`,
    image: [args.coverImage],
    url,
    inLanguage: "en-IN",
    datePublished: args.publishedAt ? new Date(args.publishedAt).toISOString() : undefined,
    dateModified: args.updatedAt ? new Date(args.updatedAt).toISOString() : undefined,
    author: {
      "@type": "Person",
      name: args.creator.displayName,
      url: `${SITE_URL}/profile/${args.creator.username}`
    },
    publisher: { "@id": `${SITE_URL}#org` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url }
  };

  const itemList: AnyJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#pieces`,
    name: `Pieces in ${args.name}`,
    numberOfItems: args.pieces.length,
    itemListElement: args.pieces.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: pieceJsonLd({
        id: p.id,
        name: p.name,
        primaryPhoto: p.primaryPhoto,
        brand: p.brand,
        sourceUrl: p.sourceUrl,
        price: p.price,
        partner: p.partner
      })
    }))
  };

  return [article, itemList];
}

// ─── Piece = Product schema (drives Google Shopping rich results) ─
export function pieceJsonLd(args: {
  id: string;
  name: string;
  primaryPhoto?: string | null;
  brand?: string | null;
  sourceUrl?: string | null;
  price?: number | null;
  partner?: { name: string } | null;
  description?: string | null;
}): AnyJsonLd {
  const product: AnyJsonLd = {
    "@type": "Product",
    "@id": `${SITE_URL}/shop/${args.id}#product`,
    name: args.name,
    image: args.primaryPhoto || undefined,
    description: args.description || `${args.name} — featured on Drippr.`,
    brand: args.brand ? { "@type": "Brand", name: args.brand } : undefined,
    url: args.sourceUrl || `${SITE_URL}/shop/${args.id}`
  };
  if (args.price !== null && args.price !== undefined) {
    product.offers = {
      "@type": "Offer",
      price: args.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: args.sourceUrl || `${SITE_URL}/shop/${args.id}`,
      seller: args.partner ? { "@type": "Organization", name: args.partner.name } : undefined
    };
  }
  return product;
}

// ─── Vibe / topic landing page ───────────────────────────────
export function vibeJsonLd(args: {
  slug: string;
  name: string;
  description: string;
  drops: Array<{ slug: string; name: string; coverImage: string }>;
}): AnyJsonLd {
  const url = `${SITE_URL}/vibe/${args.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: `${args.name} outfits — Drippr.`,
    description: args.description,
    url,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${SITE_URL}#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: args.drops.length,
      itemListElement: args.drops.map((d, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${SITE_URL}/explore/drops/${d.slug}`,
        name: d.name,
        image: d.coverImage
      }))
    }
  };
}

// ─── Breadcrumbs (use on every nested page) ──────────────────
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>): AnyJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.url
    }))
  };
}

// ─── Render helper — drop into any server component ──────────
export function JsonLd({ data }: { data: AnyJsonLd | AnyJsonLd[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // safe: schema.org JSON, no user-controlled HTML, server-rendered
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
