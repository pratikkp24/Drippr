// Wraps an affiliate URL in a network deeplink so clicks are tracked + commissioned.
// Partners we configured in seed: myntra, ajio, nykaa-fashion, zara, uniqlo, hm, mango,
// aritzia, asos, westside, souledstore, snitch.

const CUELINKS_PARTNERS = new Set([
  "myntra",
  "ajio",
  "nykaa-fashion",
  "westside",
  "souledstore",
  "snitch"
]);

export function wrapAffiliateUrl(
  originalUrl: string,
  partnerSlug: string | null | undefined,
  clickId: string
): string {
  if (!partnerSlug) return originalUrl;

  const cid = process.env.CUELINKS_CID;

  // Cuelinks covers most Indian retailers — wrap if we have a CID and it's a supported partner
  if (cid && CUELINKS_PARTNERS.has(partnerSlug)) {
    return `https://linksredirect.com/?cid=${encodeURIComponent(cid)}&source=drippr&subid=${encodeURIComponent(clickId)}&url=${encodeURIComponent(originalUrl)}`;
  }

  // Impact/Awin/direct programs need per-partner deeplink logic — add here as you wire them
  // For now, return the original URL so the user still reaches the product (no commission).
  return originalUrl;
}
