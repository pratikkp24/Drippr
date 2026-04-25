import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Static poster — shown on mobile and while video loads */}
      <Image
        src="/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="(max-width: 639px) 100vw, 1px"
        className="object-cover object-[20%_center] z-0 sm:hidden"
      />

      {/* Full-bleed video background — desktop only */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 hidden sm:block"
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
