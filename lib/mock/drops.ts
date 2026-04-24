export type MockDrop = {
  id: string;
  slug: string;
  creatorId: string;
  name: string;
  story: string;
  coverImage: string;
  vibeTags: string[];
  season: ("SUMMER" | "MONSOON" | "WINTER" | "TRANSITIONAL" | "ALL_SEASON")[];
  pieceIds: string[];
  publishedAt: string;
  saveCount: number;
};

const PHOTO_IDS = [
  "1515886657613-9f3515b0c78f", "1483985988355-763728e1935b", "1445205170230-053b83016050",
  "1556905055-8f358a7a47b2", "1558769132-cb1aea458c5e", "1467043237213-65f2da53396f",
  "1492707892479-7bc8d5a4ee93", "1509631179647-0177331693ae", "1496747611176-843222e1e57c",
  "1581044777550-4cfa60707c03", "1505022610485-0249ba5b3675", "1520006403909-838d6b92c22e",
  "1525507119028-ed4c629a60a3", "1518049362265-d5b2a6467637", "1501196354995-cbb51c65aaea",
  "1485230895905-ec40ba36b9bc", "1537832816519-689ad163238b", "1516762689617-e1cffcef479d",
  "1503342217505-b0a15ec3261c", "1495385794356-15371f348c31", "1434389677669-e08b4cac3105",
  "1441984964793-9978393574d7", "1532453288454-ba3ae3c44a82", "1512436991641-6745cdb1723f",
  "1481824429379-07aa5e5b0739", "1502716119720-b23a93e5fe1b", "1489987707025-afc232f7ea0f",
  "1515372039744-b8f02a3ae446", "1520121401995-928cd50d4e27", "1511406384665-270571899bf1",
  "1490114538077-0a7f8cb49891", "1517841905240-472988babdf9", "1617114919297-3c8ddb01f599",
  "1617135661125-143f8f2c515a"
];

function getUnsplashUrl(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800`;
}

export const MOCK_DROPS: MockDrop[] = [
  // Creator 1: mayawear (5 drops)
  {
    id: "mock-d-001",
    slug: "linen-reverie",
    creatorId: "mock-c-01",
    name: "Linen Reverie",
    story: "a collection born from the slow afternoons in pondicherry. airy, light, and essential.",
    coverImage: getUnsplashUrl(PHOTO_IDS[0]),
    vibeTags: ["minimal", "elevated-basics"],
    season: ["SUMMER", "TRANSITIONAL"],
    pieceIds: ["mock-p-001", "mock-p-002"],
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1800
  },
  {
    id: "mock-d-002",
    slug: "morning-mist",
    creatorId: "mock-c-01",
    name: "Morning Mist",
    story: "capturing the soft gradients of dawn in fluid silhouettes and muted tones.",
    coverImage: getUnsplashUrl(PHOTO_IDS[1]),
    vibeTags: ["minimal", "weekend"],
    season: ["SUMMER", "MONSOON"],
    pieceIds: ["mock-p-003", "mock-p-004"],
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1200
  },
  {
    id: "mock-d-003",
    slug: "soft-edges",
    creatorId: "mock-c-01",
    name: "Soft Edges",
    story: "blurring the lines between structure and comfort with oversized drapes.",
    coverImage: getUnsplashUrl(PHOTO_IDS[2]),
    vibeTags: ["minimal", "workwear"],
    season: ["ALL_SEASON"],
    pieceIds: ["mock-p-005", "mock-p-006"],
    publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 950
  },
  {
    id: "mock-d-004",
    slug: "monochrome-days",
    creatorId: "mock-c-01",
    name: "Monochrome Days",
    story: "a study in single-color dressing for the unapologetic minimalist.",
    coverImage: getUnsplashUrl(PHOTO_IDS[3]),
    vibeTags: ["minimal", "elevated-basics"],
    season: ["ALL_SEASON"],
    pieceIds: ["mock-p-007", "mock-p-008"],
    publishedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1100
  },
  {
    id: "mock-d-005",
    slug: "salt-and-air",
    creatorId: "mock-c-01",
    name: "Salt and Air",
    story: "breathable fabrics for coastal escapes and sun-drenched journeys.",
    coverImage: getUnsplashUrl(PHOTO_IDS[4]),
    vibeTags: ["minimal", "travel"],
    season: ["SUMMER"],
    pieceIds: ["mock-p-009", "mock-p-010"],
    publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 850
  },

  // Creator 2: khadilinen (4 drops)
  {
    id: "mock-d-006",
    slug: "earth-tones",
    creatorId: "mock-c-02",
    name: "Earth Tones",
    story: "terracotta, ochre, and charcoal. the palette of the soil we walk on.",
    coverImage: getUnsplashUrl(PHOTO_IDS[5]),
    vibeTags: ["minimal", "elevated-basics"],
    season: ["ALL_SEASON"],
    pieceIds: ["mock-p-011", "mock-p-012"],
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1400
  },
  {
    id: "mock-d-007",
    slug: "handloom-tales",
    creatorId: "mock-c-02",
    name: "Handloom Tales",
    story: "every weave has a voice. celebrating the artisans of jaipur.",
    coverImage: getUnsplashUrl(PHOTO_IDS[6]),
    vibeTags: ["minimal", "festive"],
    season: ["ALL_SEASON"],
    pieceIds: ["mock-p-013", "mock-p-014"],
    publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 900
  },
  {
    id: "mock-d-008",
    slug: "rural-modern",
    creatorId: "mock-c-02",
    name: "Rural Modern",
    story: "bringing traditional craft to the urban skyline.",
    coverImage: getUnsplashUrl(PHOTO_IDS[7]),
    vibeTags: ["minimal", "workwear"],
    season: ["TRANSITIONAL"],
    pieceIds: ["mock-p-015", "mock-p-016"],
    publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 750
  },
  {
    id: "mock-d-009",
    slug: "winter-weaves",
    creatorId: "mock-c-02",
    name: "Winter Weaves",
    story: "thick linens and light wools for for a gentle winter.",
    coverImage: getUnsplashUrl(PHOTO_IDS[8]),
    vibeTags: ["minimal", "layering"],
    season: ["WINTER"],
    pieceIds: ["mock-p-017", "mock-p-018"],
    publishedAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 600
  },

  // Creator 3: quietorbit (4 drops)
  {
    id: "mock-d-010",
    slug: "berlin-grey",
    creatorId: "mock-c-03",
    name: "Berlin Grey",
    story: "inspired by the concrete and clouds of the city. sharp and structured.",
    coverImage: getUnsplashUrl(PHOTO_IDS[9]),
    vibeTags: ["minimal", "workwear"],
    season: ["ALL_SEASON"],
    pieceIds: ["mock-p-019", "mock-p-020"],
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1650
  },
  {
    id: "mock-d-011",
    slug: "orbit-01-core",
    creatorId: "mock-c-03",
    name: "Orbit 01: Core",
    story: "the essential foundation of every modern wardrobe.",
    coverImage: getUnsplashUrl(PHOTO_IDS[10]),
    vibeTags: ["minimal", "elevated-basics"],
    season: ["ALL_SEASON"],
    pieceIds: ["mock-p-021", "mock-p-022"],
    publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1300
  },
  {
    id: "mock-d-012",
    slug: "night-cycle",
    creatorId: "mock-c-03",
    name: "Night Cycle",
    story: "after-dark essentials in deep navy and black.",
    coverImage: getUnsplashUrl(PHOTO_IDS[11]),
    vibeTags: ["minimal", "party"],
    season: ["WINTER", "TRANSITIONAL"],
    pieceIds: ["mock-p-023", "mock-p-024"],
    publishedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1100
  },
  {
    id: "mock-d-013",
    slug: "transient-states",
    creatorId: "mock-c-03",
    name: "Transient States",
    story: "fluid fabrics for a life constantly in motion.",
    coverImage: getUnsplashUrl(PHOTO_IDS[12]),
    vibeTags: ["minimal", "travel"],
    season: ["SUMMER", "TRANSITIONAL"],
    pieceIds: ["mock-p-025", "mock-p-026"],
    publishedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 880
  },

  // Creator 4: yash.wears (4 drops)
  {
    id: "mock-d-014",
    slug: "concrete-jungle",
    creatorId: "mock-c-04",
    name: "Concrete Jungle",
    story: "urban utility meets high fashion. built for the mumbai heat.",
    coverImage: getUnsplashUrl(PHOTO_IDS[13]),
    vibeTags: ["street-luxe", "casual"],
    season: ["ALL_SEASON"],
    pieceIds: ["mock-p-027", "mock-p-028"],
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1750
  },
  {
    id: "mock-d-015",
    slug: "oversized-everything",
    creatorId: "mock-c-04",
    name: "Oversized Everything",
    story: "redefining comfort with volume and bold graphics.",
    coverImage: getUnsplashUrl(PHOTO_IDS[14]),
    vibeTags: ["street-luxe", "casual"],
    season: ["TRANSITIONAL"],
    pieceIds: ["mock-p-029", "mock-p-030"],
    publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1200
  },
  {
    id: "mock-d-016",
    slug: "neon-nights",
    creatorId: "mock-c-04",
    name: "Neon Nights",
    story: "high-visibility accents for the city that never sleeps.",
    coverImage: getUnsplashUrl(PHOTO_IDS[15]),
    vibeTags: ["street-luxe", "party"],
    season: ["SUMMER"],
    pieceIds: ["mock-p-031", "mock-p-032"],
    publishedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 950
  },
  {
    id: "mock-d-017",
    slug: "retro-sport",
    creatorId: "mock-c-04",
    name: "Retro Sport",
    story: "90s athletic aesthetics reimagined for today.",
    coverImage: getUnsplashUrl(PHOTO_IDS[16]),
    vibeTags: ["street-luxe", "weekend"],
    season: ["SUMMER", "TRANSITIONAL"],
    pieceIds: ["mock-p-033", "mock-p-034"],
    publishedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1050
  },

  // Creator 5: street.logic (3 drops)
  {
    id: "mock-d-018",
    slug: "tech-wear-01",
    creatorId: "mock-c-05",
    name: "Tech Wear 01",
    story: "functionality above all. water-repellent and modular.",
    coverImage: getUnsplashUrl(PHOTO_IDS[17]),
    vibeTags: ["street-luxe", "monsoon"],
    season: ["MONSOON", "WINTER"],
    pieceIds: ["mock-p-035", "mock-p-036"],
    publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1450
  },
  {
    id: "mock-d-019",
    slug: "shibuya-crossing",
    creatorId: "mock-c-05",
    name: "Shibuya Crossing",
    story: "layered textures inspired by tokyo's busiest intersection.",
    coverImage: getUnsplashUrl(PHOTO_IDS[18]),
    vibeTags: ["street-luxe", "layering"],
    season: ["ALL_SEASON"],
    pieceIds: ["mock-p-037", "mock-p-038"],
    publishedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1150
  },
  {
    id: "mock-d-020",
    slug: "cargo-cult",
    creatorId: "mock-c-05",
    name: "Cargo Cult",
    story: "more pockets, more possibilities. utility for the modern nomad.",
    coverImage: getUnsplashUrl(PHOTO_IDS[19]),
    vibeTags: ["street-luxe", "travel"],
    season: ["ALL_SEASON"],
    pieceIds: ["mock-p-039", "mock-p-040"],
    publishedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 920
  },

  // Creator 6: shiloh.studio (3 drops)
  {
    id: "mock-d-021",
    slug: "boardroom-blues",
    creatorId: "mock-c-06",
    name: "Boardroom Blues",
    story: "confidence in tailoring. making a statement without saying a word.",
    coverImage: getUnsplashUrl(PHOTO_IDS[20]),
    vibeTags: ["workwear", "elevated-basics"],
    season: ["ALL_SEASON"],
    pieceIds: ["mock-p-041", "mock-p-042"],
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1350
  },
  {
    id: "mock-d-022",
    slug: "after-six",
    creatorId: "mock-c-06",
    name: "After Six",
    story: "transition seamlessly from the desk to the dinner table.",
    coverImage: getUnsplashUrl(PHOTO_IDS[21]),
    vibeTags: ["workwear", "party"],
    season: ["ALL_SEASON"],
    pieceIds: ["mock-p-043", "mock-p-044"],
    publishedAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1050
  },
  {
    id: "mock-d-023",
    slug: "studio-essentials",
    creatorId: "mock-c-06",
    name: "Studio Essentials",
    story: "the creative individual's uniform. versatile and durable.",
    coverImage: getUnsplashUrl(PHOTO_IDS[22]),
    vibeTags: ["workwear", "casual"],
    season: ["SUMMER", "TRANSITIONAL"],
    pieceIds: ["mock-p-045", "mock-p-046"],
    publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 850
  },

  // Creator 7: officediary (3 drops)
  {
    id: "mock-d-024",
    slug: "monsoon-officewear",
    creatorId: "mock-c-07",
    name: "Monsoon Officewear",
    story: "stay sharp even when it pours. crease-resistant and quick-dry.",
    coverImage: getUnsplashUrl(PHOTO_IDS[23]),
    vibeTags: ["workwear", "monsoon"],
    season: ["MONSOON"],
    pieceIds: ["mock-p-047", "mock-p-048"],
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1550
  },
  {
    id: "mock-d-025",
    slug: "pastel-power",
    creatorId: "mock-c-07",
    name: "Pastel Power",
    story: "soft colors for hard negotiations. reclaiming femininity in the workplace.",
    coverImage: getUnsplashUrl(PHOTO_IDS[24]),
    vibeTags: ["workwear", "minimal"],
    season: ["SUMMER"],
    pieceIds: ["mock-p-049", "mock-p-050"],
    publishedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1120
  },
  {
    id: "mock-d-026",
    slug: "winter-at-work",
    creatorId: "mock-c-07",
    name: "Winter at Work",
    story: "layering for the office AC and the walk outside.",
    coverImage: getUnsplashUrl(PHOTO_IDS[25]),
    vibeTags: ["workwear", "layering"],
    season: ["WINTER"],
    pieceIds: ["mock-p-051", "mock-p-052"],
    publishedAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 980
  },

  // Creator 8: monsoondiary (3 drops)
  {
    id: "mock-d-027",
    slug: "rainy-day-reverie",
    creatorId: "mock-c-08",
    name: "Rainy Day Reverie",
    story: "drenched in style. silhouettes that embrace the damp air.",
    coverImage: getUnsplashUrl(PHOTO_IDS[26]),
    vibeTags: ["monsoon", "layering"],
    season: ["MONSOON"],
    pieceIds: ["mock-p-053", "mock-p-054"],
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1250
  },
  {
    id: "mock-d-028",
    slug: "kochi-mist",
    creatorId: "mock-c-08",
    name: "Kochi Mist",
    story: "coastal humidity meets airy cottons in deep forest greens.",
    coverImage: getUnsplashUrl(PHOTO_IDS[27]),
    vibeTags: ["monsoon", "casual"],
    season: ["MONSOON", "SUMMER"],
    pieceIds: ["mock-p-055", "mock-p-056"],
    publishedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1050
  },
  {
    id: "mock-d-029",
    slug: "stormy-nights",
    creatorId: "mock-c-08",
    name: "Stormy Nights",
    story: "dramatic silhouettes for monsoon evening gatherings.",
    coverImage: getUnsplashUrl(PHOTO_IDS[28]),
    vibeTags: ["monsoon", "party"],
    season: ["MONSOON", "TRANSITIONAL"],
    pieceIds: ["mock-p-057", "mock-p-058"],
    publishedAt: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 870
  },

  // Creator 9: layerup.co (3 drops)
  {
    id: "mock-d-030",
    slug: "texture-play",
    creatorId: "mock-c-09",
    name: "Texture Play",
    story: "mixing wool, silk, and denim. a tactile experience.",
    coverImage: getUnsplashUrl(PHOTO_IDS[29]),
    vibeTags: ["layering", "street-luxe"],
    season: ["WINTER", "TRANSITIONAL"],
    pieceIds: ["mock-p-059", "mock-p-060"],
    publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1180
  },
  {
    id: "mock-d-031",
    slug: "london-layers",
    creatorId: "mock-c-09",
    name: "London Layers",
    story: "navigating the unpredictable weather of the big smoke.",
    coverImage: getUnsplashUrl(PHOTO_IDS[30]),
    vibeTags: ["layering", "workwear"],
    season: ["WINTER"],
    pieceIds: ["mock-p-061", "mock-p-062"],
    publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 940
  },
  {
    id: "mock-d-032",
    slug: "spring-stack",
    creatorId: "mock-c-09",
    name: "Spring Stack",
    story: "lightweight layers for the first bloom.",
    coverImage: getUnsplashUrl(PHOTO_IDS[31]),
    vibeTags: ["layering", "casual"],
    season: ["TRANSITIONAL"],
    pieceIds: ["mock-p-063", "mock-p-064"],
    publishedAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 820
  },

  // Creator 10: anoushkaknits (3 drops)
  {
    id: "mock-d-033",
    slug: "festive-knits",
    creatorId: "mock-c-10",
    name: "Festive Knits",
    story: "cozy glamour for the holiday season. hand-stitched with love.",
    coverImage: getUnsplashUrl(PHOTO_IDS[32]),
    vibeTags: ["festive", "occasion"],
    season: ["WINTER"],
    pieceIds: ["mock-p-065", "mock-p-066"],
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1220
  },
  {
    id: "mock-d-034",
    slug: "dehradun-winters",
    creatorId: "mock-c-10",
    name: "Dehradun Winters",
    story: "inspired by the mountain air and pine forests.",
    coverImage: getUnsplashUrl(PHOTO_IDS[33]),
    vibeTags: ["festive", "casual"],
    season: ["WINTER"],
    pieceIds: ["mock-p-067", "mock-p-068"],
    publishedAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1020
  },
  {
    id: "mock-d-035",
    slug: "midnight-gold",
    creatorId: "mock-c-10",
    name: "Midnight Gold",
    story: "metallic threads woven into dark textures.",
    coverImage: getUnsplashUrl(PHOTO_IDS[2]),
    vibeTags: ["festive", "party"],
    season: ["TRANSITIONAL", "WINTER"],
    pieceIds: ["mock-p-069", "mock-p-070"],
    publishedAt: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 840
  },

  // Creator 11: wanderweave (3 drops)
  {
    id: "mock-d-036",
    slug: "mediterranean-blue",
    creatorId: "mock-c-11",
    name: "Mediterranean Blue",
    story: "ready for the riviera. breezy and bright.",
    coverImage: getUnsplashUrl(PHOTO_IDS[1]),
    vibeTags: ["travel", "casual"],
    season: ["SUMMER"],
    pieceIds: ["mock-p-071", "mock-p-072"],
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1140
  },
  {
    id: "mock-d-037",
    slug: "goa-sunsets",
    creatorId: "mock-c-11",
    name: "Goa Sunsets",
    story: "relaxed fits for beachside bonfires.",
    coverImage: getUnsplashUrl(PHOTO_IDS[3]),
    vibeTags: ["travel", "weekend"],
    season: ["SUMMER", "TRANSITIONAL"],
    pieceIds: ["mock-p-073", "mock-p-074"],
    publishedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 910
  },
  {
    id: "mock-d-038",
    slug: "mountain-escape",
    creatorId: "mock-c-11",
    name: "Mountain Escape",
    story: "durable fabrics for hiking and high-altitude exploring.",
    coverImage: getUnsplashUrl(PHOTO_IDS[5]),
    vibeTags: ["travel", "casual"],
    season: ["SUMMER", "TRANSITIONAL"],
    pieceIds: ["mock-p-075", "mock-p-076"],
    publishedAt: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 780
  },

  // Creator 12: thrifted.in (2 drops)
  {
    id: "mock-d-039",
    slug: "70s-revival",
    creatorId: "mock-c-12",
    name: "70s Revival",
    story: "flares, collars, and corduroy. vintage soul, modern context.",
    coverImage: getUnsplashUrl(PHOTO_IDS[7]),
    vibeTags: ["casual", "minimal"],
    season: ["ALL_SEASON"],
    pieceIds: ["mock-p-077", "mock-p-078"],
    publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1320
  },
  {
    id: "mock-d-040",
    slug: "vintage-denim-edit",
    creatorId: "mock-c-12",
    name: "Vintage Denim Edit",
    story: "the perfect wash, already broken in.",
    coverImage: getUnsplashUrl(PHOTO_IDS[9]),
    vibeTags: ["casual", "street-luxe"],
    season: ["ALL_SEASON"],
    pieceIds: ["mock-p-079", "mock-p-080"],
    publishedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    saveCount: 1100
  }
];
