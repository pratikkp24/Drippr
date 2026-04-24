import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PARTNERS = [
  { name: "Myntra", slug: "myntra", domain: "myntra.com", logoUrl: "/partners/myntra.svg", affiliateProgram: "cuelinks", commissionRate: 5.0 },
  { name: "Ajio", slug: "ajio", domain: "ajio.com", logoUrl: "/partners/ajio.svg", affiliateProgram: "cuelinks", commissionRate: 6.5 },
  { name: "Nykaa Fashion", slug: "nykaa-fashion", domain: "nykaafashion.com", logoUrl: "/partners/nykaa.svg", affiliateProgram: "cuelinks", commissionRate: 6.0 },
  { name: "Zara", slug: "zara", domain: "zara.com", logoUrl: "/partners/zara.svg", affiliateProgram: "impact", commissionRate: 3.0 },
  { name: "Uniqlo", slug: "uniqlo", domain: "uniqlo.com", logoUrl: "/partners/uniqlo.svg", affiliateProgram: "impact", commissionRate: 4.0 },
  { name: "H&M", slug: "hm", domain: "hm.com", logoUrl: "/partners/hm.svg", affiliateProgram: "awin", commissionRate: 7.0 },
  { name: "Mango", slug: "mango", domain: "mango.com", logoUrl: "/partners/mango.svg", affiliateProgram: "awin", commissionRate: 5.0 },
  { name: "Aritzia", slug: "aritzia", domain: "aritzia.com", logoUrl: "/partners/aritzia.svg", affiliateProgram: "impact", commissionRate: 8.0 },
  { name: "Asos", slug: "asos", domain: "asos.com", logoUrl: "/partners/asos.svg", affiliateProgram: "awin", commissionRate: 5.0 },
  { name: "Westside", slug: "westside", domain: "westside.com", logoUrl: "/partners/westside.svg", affiliateProgram: "cuelinks", commissionRate: 4.0 },
  { name: "The Souled Store", slug: "souledstore", domain: "thesouledstore.com", logoUrl: "/partners/souledstore.svg", affiliateProgram: "cuelinks", commissionRate: 6.0 },
  { name: "Snitch", slug: "snitch", domain: "snitch.co.in", logoUrl: "/partners/snitch.svg", affiliateProgram: "cuelinks", commissionRate: 7.0 }
];

async function main() {
  for (const p of PARTNERS) {
    await prisma.partner.upsert({
      where: { slug: p.slug },
      create: p,
      update: { logoUrl: p.logoUrl, commissionRate: p.commissionRate, affiliateProgram: p.affiliateProgram }
    });
  }
  console.log(`Seeded ${PARTNERS.length} partners.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
