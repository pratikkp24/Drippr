import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

const CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

type PartnerInfo = { id: string; name: string; slug: string } | null;

type ScrapeResult = {
  title: string;
  brand: string;
  image: string;
  price: number | null;
  sourceUrl: string;
  category: string;
  partner: PartnerInfo;
  partial: boolean; // true = we couldn't fully extract — UI should ask the user to fill gaps
};

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const host = parsed.hostname.replace(/^www\./, "");
    const partner = await lookupPartner(host);
    const urlHints = deriveFromUrl(parsed, partner?.name);

    // 1) Direct fetch with Chrome UA — cheap, no external deps, works for most sites
    const direct = await tryDirectFetch(url);
    if (direct) {
      const merged: ScrapeResult = {
        title: direct.title || urlHints.nameFromSlug || "",
        brand: direct.brand || urlHints.brandFromPath || host.split(".")[0],
        image: direct.image || "",
        price: direct.price ?? null,
        sourceUrl: url,
        category: urlHints.category,
        partner,
        partial: !direct.title || !direct.image
      };
      return NextResponse.json(merged);
    }

    // 2) Microlink fallback
    const micro = await tryMicrolink(url);
    if (micro) {
      const merged: ScrapeResult = {
        title: micro.title || urlHints.nameFromSlug || "",
        brand: micro.brand || urlHints.brandFromPath || host.split(".")[0],
        image: micro.image || "",
        price: null,
        sourceUrl: url,
        category: urlHints.category,
        partner,
        partial: !micro.title || !micro.image
      };
      return NextResponse.json(merged);
    }

    // 3) Last-resort: return whatever we can derive from the URL so the form can open
    const fallback: ScrapeResult = {
      title: urlHints.nameFromSlug || "",
      brand: urlHints.brandFromPath || host.split(".")[0],
      image: "",
      price: null,
      sourceUrl: url,
      category: urlHints.category,
      partner,
      partial: true
    };
    return NextResponse.json(fallback);
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function lookupPartner(domain: string): Promise<PartnerInfo> {
  try {
    const p = await prisma.partner.findFirst({
      where: { domain: { contains: domain.split(".")[0] } },
      select: { id: true, name: true, slug: true }
    });
    return p;
  } catch {
    return null;
  }
}

function deriveFromUrl(parsed: URL, partnerName?: string | null) {
  const segs = parsed.pathname.split("/").filter(Boolean);
  // Myntra: /shirts/mischief+monkey/mischief-monkey-men-classic-casual-shirt/33629784/buy
  // Ajio: /shop/sale.html or /p/brand-product-name
  // Zara: /in/en/product-name-p12345.html
  const decoded = segs.map((s) => decodeURIComponent(s).replace(/\+/g, " "));

  let category = "TOPS";
  const CATEGORY_MAP: Record<string, string> = {
    shirts: "TOPS", "t-shirts": "TOPS", tshirts: "TOPS", tops: "TOPS", blouses: "TOPS", knitwear: "TOPS",
    jeans: "BOTTOMS", trousers: "BOTTOMS", pants: "BOTTOMS", shorts: "BOTTOMS", skirts: "BOTTOMS", bottoms: "BOTTOMS",
    dresses: "DRESSES", gowns: "DRESSES",
    jackets: "OUTERWEAR", coats: "OUTERWEAR", blazers: "OUTERWEAR", outerwear: "OUTERWEAR",
    shoes: "FOOTWEAR", sneakers: "FOOTWEAR", boots: "FOOTWEAR", sandals: "FOOTWEAR", heels: "FOOTWEAR", footwear: "FOOTWEAR",
    bags: "BAGS", backpacks: "BAGS", handbags: "BAGS",
    jewellery: "JEWELRY", jewelry: "JEWELRY", earrings: "JEWELRY", necklaces: "JEWELRY",
    accessories: "ACCESSORIES", belts: "ACCESSORIES", scarves: "ACCESSORIES", hats: "ACCESSORIES"
  };
  for (const s of decoded) {
    const key = s.toLowerCase();
    if (CATEGORY_MAP[key]) {
      category = CATEGORY_MAP[key];
      break;
    }
  }

  // Myntra-style: second segment is often the brand
  const brandFromPath = decoded[1]?.replace(/-/g, " ") ?? null;

  // Try to get a readable product name from the slug-like segments
  const slugCandidate = decoded
    .slice(1)
    .find((s) => /-/.test(s) && s.length > 6 && !/^\d+$/.test(s));
  const nameFromSlug = slugCandidate
    ? titleCase(slugCandidate.replace(/-/g, " ").replace(/\.html?$/i, ""))
    : null;

  return {
    category,
    brandFromPath: brandFromPath ? titleCase(brandFromPath) : (partnerName ?? null),
    nameFromSlug
  };
}

function titleCase(s: string) {
  return s
    .split(" ")
    .map((w) => (w.length <= 2 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ")
    .trim();
}

async function tryDirectFetch(url: string): Promise<{
  title: string;
  brand: string;
  image: string;
  price: number | null;
} | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, {
      headers: {
        "User-Agent": CHROME_UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br"
      },
      redirect: "follow",
      signal: ctrl.signal
    }).catch(() => null);
    clearTimeout(timer);
    if (!res || !res.ok) return null;
    const html = await res.text();
    if (!html || html.length < 200) return null;

    const meta = (name: string) => {
      const rx = new RegExp(
        `<meta[^>]*(?:name|property)=["']${escapeRegex(name)}["'][^>]*content=["']([^"']+)["']`,
        "i"
      );
      const alt = new RegExp(
        `<meta[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["']${escapeRegex(name)}["']`,
        "i"
      );
      return html.match(rx)?.[1] || html.match(alt)?.[1] || null;
    };

    const title =
      meta("og:title") ||
      meta("twitter:title") ||
      html.match(/<title>([^<]+)<\/title>/i)?.[1] ||
      "";

    const image = meta("og:image") || meta("twitter:image") || "";

    const description = meta("og:description") || meta("twitter:description") || meta("description") || "";

    // Price hunting: OG tag, JSON-LD, then description text
    let price: number | null = null;
    const priceFromMeta = meta("product:price:amount") || meta("og:price:amount");
    if (priceFromMeta) price = parseFloat(priceFromMeta.replace(/[^\d.]/g, ""));
    if (!price) {
      const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
      if (jsonLdMatch) {
        try {
          const ld = JSON.parse(jsonLdMatch[1]);
          const offers = Array.isArray(ld) ? ld.flatMap((x) => x.offers || []) : ld.offers;
          const priceValue =
            offers?.price ||
            offers?.lowPrice ||
            (Array.isArray(offers) ? offers[0]?.price : null);
          if (priceValue) price = parseFloat(String(priceValue).replace(/[^\d.]/g, ""));
        } catch {
          /* ignore */
        }
      }
    }
    if (!price && description) {
      const m = description.match(/(?:Rs\.?|INR|₹|\$|€|£)\s*([\d,]+(?:\.\d+)?)/i);
      if (m) price = parseFloat(m[1].replace(/,/g, ""));
    }

    // Clean "Buy X - for Men from Y at Rs. Z" → "X"
    const cleanedTitle = title
      .replace(/^Buy\s+/i, "")
      .replace(/\s+-\s+.*?(?:from|Apparel|Online).*$/i, "")
      .replace(/\s+\|\s+.*$/, "")
      .replace(/\s+at\s+Rs\.?\s*[\d,]+.*$/i, "")
      .trim();

    const brand =
      meta("og:brand") ||
      meta("product:brand") ||
      (cleanedTitle.match(/^([A-Z][A-Z &]+)(?:\s+[A-Z][a-z])/)?.[1]?.trim() ?? "");

    return {
      title: cleanedTitle,
      brand,
      image,
      price
    };
  } catch {
    return null;
  }
}

async function tryMicrolink(url: string) {
  try {
    const apiKey = process.env.MICROLINK_API_KEY;
    const endpoint = `https://api.microlink.io?url=${encodeURIComponent(url)}&audio=false&video=false`;
    const res = await fetch(endpoint, {
      headers: apiKey ? { "x-api-key": apiKey } : undefined
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.status !== "success") return null;
    const m = data.data;
    return {
      title: m?.title || "",
      brand: m?.publisher || "",
      image: m?.image?.url || m?.logo?.url || ""
    };
  } catch {
    return null;
  }
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
