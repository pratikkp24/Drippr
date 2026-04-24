import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";

export default async function LandingPage() {
  const user = await getUser();
  if (user) redirect("/home");
  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <header className="px-lg sm:px-xl py-lg flex items-center justify-between">
        <div className="text-[22px] font-semibold text-primary">Drippr.</div>
        <nav className="flex items-center gap-md">
          <Link
            href="/signin"
            className="text-[14px] text-text-2 hover:text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="h-10 px-md inline-flex items-center rounded-md bg-primary text-bg text-[14px] font-medium hover:bg-primary-hover transition-colors"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="flex-1 flex items-center px-lg sm:px-xl">
        <div className="max-w-[760px] mx-auto w-full animate-slideUp">
          <p className="text-[12px] tracking-[2px] uppercase text-text-2 mb-lg">
            A private fashion club
          </p>
          <h1 className="fraunces text-[clamp(44px,7vw,84px)] leading-[1.02] text-text-1 mb-lg">
            Dress with <em className="italic">intent.</em>
          </h1>
          <p className="font-light text-[18px] text-text-2 max-w-[560px] mb-xl">
            Curate your closet. Follow creators whose taste you trust. Shop from the brands you
            already love — nothing to haggle over, nothing to install.
          </p>
          <div className="flex gap-md">
            <Link
              href="/signup"
              className="h-[54px] px-xl inline-flex items-center rounded-md bg-primary text-bg text-[15px] font-medium hover:bg-primary-hover transition-colors"
            >
              Start your closet
            </Link>
            <Link
              href="/signin"
              className="h-[54px] px-xl inline-flex items-center rounded-md border border-border text-text-1 text-[15px] font-medium hover:border-accent transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-lg sm:px-xl py-lg text-[12px] font-light text-text-3">
        © Drippr.
      </footer>
    </main>
  );
}
