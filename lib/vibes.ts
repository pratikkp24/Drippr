// Vibe taxonomy. Drives /vibe/[tag] pages, sitemap, structured data,
// and onboarding/taste vibe selection.

export type Vibe = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  keywords: string[];
  seasonHint: string[];
  heroImage: string;
};

export const VIBES: Vibe[] = [
  {
    slug: "minimal",
    name: "Minimal",
    tagline: "Less. But better.",
    description:
      "Quiet shapes, neutral palette, considered fabrics. Outfits built from a small set of pieces that play well with each other. The opposite of trends.",
    keywords: ["minimalist fashion", "capsule wardrobe", "neutral outfits", "quiet luxury India"],
    seasonHint: ["ALL_SEASON"],
    heroImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80"
  },
  {
    slug: "elevated-basics",
    name: "Elevated basics",
    tagline: "Plain — done right.",
    description:
      "The white tee that actually fits. The denim that drapes. Foundation pieces in better fabric, better cut, better proportions. Boring on paper, magnetic in person.",
    keywords: ["elevated basics", "premium basics India", "well-cut clothes", "everyday outfits"],
    seasonHint: ["ALL_SEASON"],
    heroImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80"
  },
  {
    slug: "street-luxe",
    name: "Street-luxe",
    tagline: "Sharper than it looks.",
    description:
      "Sneakers with tailoring. Hoodies under blazers. The street sensibility of streetwear with the materials and finish of designer. Built for cities.",
    keywords: ["streetwear India", "street luxe outfits", "premium streetwear", "urban fashion"],
    seasonHint: ["ALL_SEASON", "TRANSITIONAL"],
    heroImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80"
  },
  {
    slug: "workwear",
    name: "Workwear",
    tagline: "Office-ready, never office-stiff.",
    description:
      "Trousers with structure. Shirts that breathe. Layers that read sharp without screaming corporate. Outfits for the modern Indian workplace and the commute it takes to get there.",
    keywords: ["workwear India", "office outfits", "modern formal", "smart casual women men"],
    seasonHint: ["ALL_SEASON"],
    heroImage: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=1200&q=80"
  },
  {
    slug: "weekend",
    name: "Weekend",
    tagline: "What you actually wear on Saturday.",
    description:
      "Easy fits. Comfortable fabrics. Outfits that move with you from brunch to a long walk to a friend's place. Effort that doesn't look like effort.",
    keywords: ["weekend outfits", "casual fashion India", "brunch outfits", "Saturday looks"],
    seasonHint: ["ALL_SEASON"],
    heroImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80"
  },
  {
    slug: "monsoon",
    name: "Monsoon",
    tagline: "Built for the rain.",
    description:
      "Quick-dry fabrics. Smart shoes. Layers you can shed and re-add. Outfits engineered for Indian monsoon — Mumbai, Bangalore, Goa — without compromising taste.",
    keywords: ["monsoon outfits India", "rainy season fashion", "Mumbai monsoon style", "rain-friendly outfits"],
    seasonHint: ["MONSOON"],
    heroImage: "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=1200&q=80"
  },
  {
    slug: "occasion",
    name: "Occasion",
    tagline: "For when it actually matters.",
    description:
      "Weddings, dinners, milestones. Outfits with intent — sharp tailoring, considered drape, the right shoe. Dressed up without dressing the part.",
    keywords: ["occasion wear India", "wedding guest outfits", "evening wear", "dressy outfits"],
    seasonHint: ["ALL_SEASON"],
    heroImage: "https://images.unsplash.com/photo-1589465885857-44edb59bbff2?w=1200&q=80"
  },
  {
    slug: "layering",
    name: "Layering",
    tagline: "Three pieces, one outfit.",
    description:
      "Vest over shirt over tee. Open shirt over fitted base. The art of building dimension with what you already own. Works in transitional weather and in air-conditioned everywhere.",
    keywords: ["layered outfits", "layering fashion", "transitional dressing", "smart layering"],
    seasonHint: ["TRANSITIONAL", "WINTER"],
    heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80"
  },
  {
    slug: "travel",
    name: "Travel",
    tagline: "Pack lighter. Look better.",
    description:
      "Wrinkle-resistant fabrics. Pieces that mix in 6+ ways. Outfits that move from airport to dinner without a stop at the hotel. For people who travel often and refuse to look it.",
    keywords: ["travel outfits", "vacation wardrobe", "capsule travel wardrobe", "airport style India"],
    seasonHint: ["ALL_SEASON"],
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
  },
  {
    slug: "party",
    name: "Party",
    tagline: "Built to be remembered.",
    description:
      "Statement pieces. Bold cuts. The outfit you wear when you want the room to look. Tasteful drama — because a party is a stage.",
    keywords: ["party outfits", "going out fashion", "statement looks", "club outfits India"],
    seasonHint: ["ALL_SEASON"],
    heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80"
  },
  {
    slug: "festive",
    name: "Festive",
    tagline: "Tradition, on your terms.",
    description:
      "Indian-modern. Kurtas with sneakers. Saris with crop-tops. Lehengas styled with restraint. Festive outfits that nod to heritage without becoming costume.",
    keywords: ["festive outfits India", "Diwali fashion", "Indo-western", "modern Indian wear"],
    seasonHint: ["ALL_SEASON"],
    heroImage: "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=1200&q=80"
  },
  {
    slug: "casual",
    name: "Casual",
    tagline: "Effortless, not lazy.",
    description:
      "Tee, jeans, white sneaker — done well. Casual that respects fit, fabric, and proportion. The default uniform of people with taste.",
    keywords: ["casual outfits", "everyday fashion", "smart casual India", "weekday casual"],
    seasonHint: ["ALL_SEASON"],
    heroImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=80"
  }
];

export function getVibe(slug: string): Vibe | undefined {
  return VIBES.find((v) => v.slug === slug);
}
