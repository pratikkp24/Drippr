export type MockPiece = {
  id: string;
  name: string;
  brand: string;
  category: "TOPS" | "BOTTOMS" | "DRESSES" | "OUTERWEAR" | "FOOTWEAR" | "ACCESSORIES" | "BAGS" | "JEWELRY";
  primaryPhoto: string;
  price: number;
  partnerSlug: "myntra" | "ajio" | "nykaa-fashion" | "zara" | "uniqlo" | "hm" | "mango" | "aritzia" | "asos" | "westside" | "souledstore" | "snitch";
  partnerProductUrl: string;
  color: string;
  tags: string[];
};

const PIECE_PHOTOS = [
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
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=400&h=400`;
}

const BRANDS = ["Zara", "Uniqlo", "H&M", "Mango", "Aritzia", "ASOS", "Westside", "Souled Store", "Snitch", "Roadster", "HRX", "Fig", "Netplay", "Nykaa Luxe"];
const PARTNERS = ["myntra", "ajio", "nykaa-fashion", "zara", "uniqlo", "hm", "mango", "aritzia", "asos", "westside", "souledstore", "snitch"] as const;

export const MOCK_PIECES: MockPiece[] = Array.from({ length: 80 }).map((_, i) => {
  const idNum = i + 1;
  const partnerSlug = PARTNERS[i % 12];
  const photoIndex = i % PIECE_PHOTOS.length;
  
  const categories: MockPiece["category"][] = ["TOPS", "BOTTOMS", "DRESSES", "OUTERWEAR", "FOOTWEAR", "ACCESSORIES", "BAGS", "JEWELRY"];
  const category = categories[i % categories.length];

  return {
    id: `mock-p-${idNum.toString().padStart(3, "0")}`,
    name: `${category.toLowerCase()} piece ${idNum}`,
    brand: BRANDS[i % BRANDS.length],
    category,
    primaryPhoto: getUnsplashUrl(PIECE_PHOTOS[photoIndex]),
    price: 1200 + (i * 200),
    partnerSlug,
    partnerProductUrl: `https://www.${partnerSlug}.com/product/mock-${idNum}`,
    color: ["ivory", "forest", "charcoal", "navy", "terracotta"][i % 5],
    tags: ["essential", "minimal", "modern"].slice(0, (i % 3) + 1)
  };
});
