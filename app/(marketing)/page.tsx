import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "A private fashion club",
  description:
    "Curated closets from creators you trust. Shop the brands you already love — Myntra, Ajio, Zara, Uniqlo and more. No hauls. No noise. Just real outfits.",
  alternates: { canonical: "/" }
};

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />

      {/*
        Hero strategy:
        - <Image> poster is the LCP element (priority + fetchPriority high)
        - <video> overlays it, preload="none" so it doesn't compete for bytes
          before the poster paints. The video then starts downloading + autoplaying
          once the page is interactive.
        - On mobile, video may not autoplay until user interacts (data-saver, low-power),
          but the poster is identical so the page looks complete either way.
      */}
      <img
        src="/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        // eslint-disable-next-line @next/next/no-img-element
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-[35%_center] sm:object-center z-0"
      />
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        poster="/hero-poster.jpg"
        // eslint-disable-next-line react/no-unknown-property
        x-webkit-airplay="deny"
        // eslint-disable-next-line react/no-unknown-property
        disablePictureInPicture
        // eslint-disable-next-line react/no-unknown-property
        disableRemotePlayback
        className="absolute inset-0 w-full h-full object-cover object-[35%_center] sm:object-center z-0"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Watermark cover — desktop only */}
      <div className="hidden sm:block absolute bottom-0 right-0 w-56 h-20 bg-gradient-to-tl from-black/80 to-transparent z-10" />

      <header className="relative z-20 px-lg sm:px-xl py-lg flex items-center justify-between">
        <div className="text-[22px] font-semibold text-white">Drippr.</div>
        <nav className="flex items-center gap-md">
          <Link
            href="/signin"
            className="text-[14px] text-white/70 hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="h-10 px-md inline-flex items-center rounded-md bg-white text-primary text-[14px] font-medium hover:bg-white/90 transition-colors"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="relative z-20 flex-1 flex items-center px-lg sm:px-xl">
        <div className="max-w-[760px] mx-auto w-full animate-slideUp">
          <p className="text-[12px] tracking-[2px] uppercase text-white/60 mb-lg">
            A private fashion club
          </p>
          <h1 className="fraunces text-[clamp(44px,7vw,84px)] leading-[1.02] text-white mb-lg">
            Dress with <em className="italic">intent.</em>
          </h1>
          <p className="font-light text-[18px] text-white/70 max-w-[560px] mb-xl">
            Curate your closet. Follow creators whose taste you trust. Shop from the brands you
            already love — nothing to haggle over, nothing to install.
          </p>
          <div className="flex flex-col sm:flex-row gap-md">
            <Link
              href="/signup"
              className="h-[54px] px-xl inline-flex items-center justify-center rounded-md bg-white text-primary text-[15px] font-medium hover:bg-white/90 transition-colors"
            >
              Start your closet
            </Link>
            <Link
              href="/explore"
              className="h-[54px] px-xl inline-flex items-center justify-center rounded-md border border-white/30 text-white text-[15px] font-medium hover:border-white/60 transition-colors"
            >
              Explore first
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-20 px-lg sm:px-xl py-lg text-[12px] font-light text-white/40">
        © Drippr.
      </footer>
    </main>
  );
}
